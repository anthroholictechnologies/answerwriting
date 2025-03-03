import { prisma } from "answerwriting/prisma";
import {
  handlePaymentFailed,
  handlePaymentPending,
  handlePaymentSuccess,
} from "answerwriting/services/payments.service";
import { getPaymentStatus } from "answerwriting/services/phonepay";
import { ApiRoutePaths, ErrorCodes } from "answerwriting/types/general.types";
import {
  Duration,
  PhonePayTransactionStates,
} from "answerwriting/types/payment.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const merchantTransactionId = searchParams.get("id");

    // Validate if merchantTransactionId is present
    if (!merchantTransactionId) {
      throw new Error(`Merchant transaction Id Missing`);
    }

    // Fetch the payment status from PhonePe's API
    const resp = await getPaymentStatus(merchantTransactionId);

    // Retrieve the transaction from the database
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: merchantTransactionId,
      },
      include: {
        order: {
          include: {
            user: true,
            product: true,
          },
        },
      },
    });

    // If transaction is not found, return an error
    if (!transaction) {
      throw new Error(`Transaction not found`);
    }
    const order = transaction.order;
    const user = transaction.order?.user;
    const product = transaction.order?.product;

    if (!order || !user || !product)
      throw new Error(`Either of order user or product missing.`);
    // Store the raw payment response JSON for debugging/audit purposes
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { paymentResultJSON: JSON.stringify(resp) },
    });

    // Extract the payment status
    const paymentState = resp.state;

    // Handle different transaction statuses
    if (paymentState === PhonePayTransactionStates.COMPLETED) {
      await handlePaymentSuccess({
        transactionId: transaction.id,
        orderId: order.id,
        userId: user.id,
        duration: product.duration as Duration,
      });
      return NextResponse.redirect(
        `${process.env.APP_BASE_URI}${ApiRoutePaths.PAGE_PAYMENT_STATUS}?status=success`,
        { status: 301 },
      );
    } else if (paymentState === PhonePayTransactionStates.PENDING) {
      await handlePaymentPending({
        transactionId: transaction.id,
      });
      return NextResponse.redirect(
        `${process.env.APP_BASE_URI}${ApiRoutePaths.PAGE_PAYMENT_STATUS}?status=pending`,
        { status: 301 },
      );
    } else {
      await handlePaymentFailed({
        transactionId: transaction.id,
      });
      // Redirect to failure page
      return NextResponse.redirect(
        `${process.env.APP_BASE_URI}${ApiRoutePaths.PAGE_PAYMENT_STATUS}?status=failure`,
        { status: 301 },
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    // Return a JSON error response in case of an exception
    return NextResponse.json({
      success: false,
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: err.message, // Provide an error message for debugging
    });
  }
}
