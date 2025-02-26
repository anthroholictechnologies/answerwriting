import { prisma } from "answerwriting/prisma";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";
import {
  InitiatePaymentResponse,
  PaymentStatus,
  SubscriptionStatus,
} from "answerwriting/types/payment.types";
import { PurchaseInput } from "answerwriting/validations/payment.schema";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "answerwriting/auth";
import cuid from "cuid";
import { initiatePayment } from "answerwriting/services/payments.service";

/**
 * Validates required environment variables.
 */
function validateEnvVariables() {
  const requiredEnvVars = [
    //Unique Merchant ID assigned to the merchant by PhonePe
    "PHONE_PAY_MERCHANT_ID",
    //Unique Salt Key provided by PhonePe
    "PHONE_PAY_SALT_KEY",
    //Unique Salt Index provided by PhonePe
    "PHONE_PAY_SALT_INDEX",
    //Base URL of PhonePe's payment gateway differes in
    "PHONE_PAY_BASE_URI",
    //Our App's Base URI
    "APP_BASE_URI",
  ];

  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      throw new Error(
        `Purchase API Error - Missing environment variable: ${key}`,
      );
    }
  }
}

/*
  - Purchase subscription API
  - Step 1: Check all the env vars are present
  - Step 2: Double check if the user is authenticated or not, 
  - Step 3: Check if the user already has an ACTIVE or PENDING subscription, if yes, return an error.
  - Step 4: Grab the billing option from db whose id is sent from the FE
  - Step 5: Initiate the payment 
*/
export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<InitiatePaymentResponse>>> {
  try {
    // Step 1: Validate the env variables, all the env variables required for PhonePay must be present.
    validateEnvVariables();

    // Step 2: Grab the user and check if they are authenticated
    const session = await auth();
    if (!session) {
      console.error("Purchase API Error - User not authenticated");
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated",
          errorCode: ErrorCodes.UNAUTHORIZED,
        },
        { status: 401 },
      );
    }

    // Step 3: Check if the user already has an ACTIVE or PENDING subscription
    const sessionUser = session.user;
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: {
        subscriptions: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        errorCode: ErrorCodes.USER_NOT_FOUND,
      });
    }
    const userSubscriptions = user.subscriptions;

    if (userSubscriptions) {
      const hasActiveOrPendingSubscriptions = user.subscriptions.find(
        (sub) =>
          sub.subscriptionStatus &&
          [SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING].includes(
            sub.subscriptionStatus as SubscriptionStatus,
          ),
      );
      if (hasActiveOrPendingSubscriptions) {
        console.error(
          "Purchase API Error - User already has an subscription in either active or pending state",
        );
        return NextResponse.json(
          {
            success: false,
            message: "User already has an active subscription",
            errorCode: ErrorCodes.ALREADY_SUBSCRIBED,
          },
          { status: 400 },
        );
      }
    }

    // Step 4: Frontend will send the billing option id. Grab it from the database
    const { billingOptionId } = (await req.json()) as PurchaseInput;
    const billingOption = await prisma.billingOption.findUnique({
      where: { id: billingOptionId },
    });

    if (!billingOption) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid billing option",
          errorCode: ErrorCodes.INVALID_BILLING_OPTIONS,
        },
        { status: 400 },
      );
    }

    // Step 5 : Create a subscription with payment,
    // The paymentId is merchant Traxn ID and userId is merchant User id
    const amount = billingOption.totalPrice;
    const merchantTransactionId = cuid();
    const merchantUserId = user.id;
    await prisma.subscription.create({
      data: {
        subscriptionStatus: SubscriptionStatus.PENDING,
        billingOptionId: billingOption.id,
        userId: user.id,
        planId: billingOption.planId,
        payment: {
          create: {
            id: merchantTransactionId,
            amount,
            paymentJSON: {},
            status: PaymentStatus.PENDING,
            userId: user.id,
          },
        },
      },
      include: {
        payment: true,
      },
    });

    // Step 6: Inititate the Payment
    const initiatePaymentResponse = (await initiatePayment({
      merchantTransactionId,
      merchantUserId,
      amountInPaisa: amount,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;

    console.log(
      "PAYMENT API - INITIATE PAYMENT RESPONSE",
      initiatePaymentResponse,
    );

    const paymentGatewayUrl =
      initiatePaymentResponse?.data?.instrumentResponse?.redirectInfo?.url;

    if (paymentGatewayUrl) {
      return NextResponse.json({
        success: true,
        message: "Payment request sent to PhonePe",
        data: {
          paymentGatewayUrl:
            initiatePaymentResponse?.data?.instrumentResponse?.redirectInfo
              ?.url,
        },
      });
    } else {
      return NextResponse.json(
        {
          errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
          message: "Failed Purchase",
          success: false,
        },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("Error purchasing the plan:", err);
    return NextResponse.json(
      {
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: "Failed Purchase",
        success: false,
      },
      { status: 500 },
    );
  }
}
