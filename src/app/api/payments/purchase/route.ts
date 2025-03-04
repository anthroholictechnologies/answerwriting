import { prisma } from "answerwriting/prisma";
import {
  ApiResponse,
  ErrorCodes,
  ENVNext,
} from "answerwriting/types/general.types";
import {
  CancellationReason,
  InitiatePaymentResponse,
  PaymentInitiationResponse,
  Sandbox_PhonePePaymentInitiationResponse,
  SubscriptionStatus,
  TransactionStatus,
} from "answerwriting/types/payment.types";
import { PurchaseInput } from "answerwriting/validations/payment.schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "answerwriting/auth";
import cuid from "cuid";
import { getPaymentPage } from "answerwriting/services/phonepay";
/**
 * Handles payment initiation and subscription creation.
 */
async function handlePayment({
  userId,
  productId,
  amount,
}: {
  userId: string;
  productId: string;
  amount: number;
}) {
  const merchantOrderId = cuid();
  const getPaymentPageResponse = await getPaymentPage({
    merchantOrderId,
    amount,
    merchantUserId: userId,
  });

  let paymentGatewayUrl;
  if (process.env.ENV_NEXT !== ENVNext.PRODUCTION) {
    paymentGatewayUrl = (
      getPaymentPageResponse as Sandbox_PhonePePaymentInitiationResponse
    )?.data?.instrumentResponse?.redirectInfo?.url;
  } else {
    paymentGatewayUrl = (getPaymentPageResponse as PaymentInitiationResponse)
      .redirectUrl;
  }

  if (!paymentGatewayUrl) throw new Error("Payment gateway URL is missing");

  await prisma.$transaction(async (tx) => {
    const createdTransaction = await tx.transaction.create({
      data: {
        id: merchantOrderId,
        amount,
        paymentInitiationJSON: JSON.stringify(getPaymentPageResponse),
        history: {
          create: {
            status: TransactionStatus.STARTED,
          },
        },
      },
    });

    return await tx.order.create({
      data: {
        userId,
        productId,
        transactionId: createdTransaction.id,
      },
    });
  });

  return paymentGatewayUrl;
}

/*
  - Step1: Check if the user is autheticated or not.
  - Step2: Check if the product exists in the database.
  - Step3: Check the lastest order of the user
           - If exists
              - CREATED => CANCEL IT AND CREATE NEW
              - FAILED, PURCHASED, CANCELLED => CREATE NEW
              - PENDING => THROW ERROR
*/
export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<InitiatePaymentResponse>>> {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated",
          errorCode: ErrorCodes.UNAUTHORIZED,
        },
        { status: 401 }
      );
    }

    const { productId } = (await req.json()) as PurchaseInput;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
          errorCode: ErrorCodes.PRODUCT_NOT_FOUND,
        },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: {
          include: {
            history: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        },
        orders: {
          include: {
            transaction: {
              include: {
                history: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  take: 1,
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          errorCode: ErrorCodes.USER_NOT_FOUND,
        },
        { status: 404 }
      );
    }
    const userSubscription = user.subscription;
    const status = userSubscription?.history?.[0]?.status;

    if (status === SubscriptionStatus.ACTIVE) {
      return NextResponse.json(
        {
          success: false,
          message: "User already has an active subscription",
          errorCode: ErrorCodes.USER_ALREADY_HAS_ACTIVE_SUBSCRIPTION,
        },
        { status: 409 }
      );
    }

    const [latestOrder] = user.orders;

    if (latestOrder) {
      const transaction = latestOrder.transaction!;
      const orderTransactionStatus = transaction?.history?.[0]?.status;
      if (orderTransactionStatus === TransactionStatus.PENDING) {
        return NextResponse.json({
          success: false,
          message:
            "Order already pending. Complete the previous order before proceeding.",
          errorCode: ErrorCodes.ORDER_ALREADY_PENDING,
        });
      } else if (orderTransactionStatus === TransactionStatus.STARTED) {
        await prisma.$transaction(async (tx) => {
          await tx.transactionStatusHistory.create({
            data: {
              transactionId: transaction.id,
              status: TransactionStatus.CANCELLED,
            },
          });
          await tx.transaction.update({
            where: {
              id: transaction.id,
            },
            data: {
              cancellationReason: CancellationReason.NEW_ORDER_CREATED,
            },
          });
        });
      }
    }

    const paymentGatewayUrl = await handlePayment({
      amount: product.totalPrice,
      productId: product.id,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Payment request sent to PhonePe",
      data: { paymentGatewayUrl },
    });
  } catch (err) {
    console.error("Error purchasing the plan:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed Purchase",
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
