import { prisma } from "answerwriting/prisma";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";
import {
  CancellationReason,
  InitiatePaymentResponse,
  TransactionStatus,
} from "answerwriting/types/payment.types";
import { PurchaseInput } from "answerwriting/validations/payment.schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "answerwriting/auth";
import cuid from "cuid";
import { initiatePayment } from "answerwriting/services/payments.service";
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
  const merchantTransactionId = cuid();
  const initiatePaymentResponse = await initiatePayment({
    merchantTransactionId,
    merchantUserId: userId,
    amountInPaisa: amount,
  });

  const paymentGatewayUrl =
    initiatePaymentResponse?.data?.instrumentResponse?.redirectInfo?.url;
  if (!paymentGatewayUrl) throw new Error("Payment gateway URL is missing");
  await prisma.$transaction(async (tx) => {
    const createdTransaction = await tx.transaction.create({
      data: {
        id: merchantTransactionId,
        amount,
        paymentInitiationJSON: initiatePaymentResponse,
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
        transactionId: createdTransaction.id, // ✅ Explicitly linking Transaction
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
    // STEP 1: Check if the user is authenticated or not
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

    // STEP 2: CHECK THE PRODUCT EXISTS IN THE DATABASE
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
      return NextResponse.json({
        success: false,
        message: "User not found",
        errorCode: ErrorCodes.USER_NOT_FOUND,
      });
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
