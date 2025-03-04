import { TransactionStatus } from "@prisma/client";
import { prisma } from "answerwriting/prisma";
import {
  handlePaymentFailed,
  handlePaymentPending,
  handlePaymentSuccess,
} from "answerwriting/services/payments.service";
import { getPaymentStatus } from "answerwriting/services/phonepay";
import { ErrorCodes, NodeENV } from "answerwriting/types/general.types";
import {
  Duration,
  PaymentStatusCheckResponse,
  PhonePayTransactionStates,
  Sandbox_PaymentStatusCheckResponse,
} from "answerwriting/types/payment.types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log(`Running the cron job to update the transaction status`);
    const transactionsWithTheirLatestStatus = await prisma.transaction.findMany(
      {
        include: {
          order: {
            include: {
              user: true,
              product: true,
            },
          },
          history: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      }
    );

    const pendingTransactions = transactionsWithTheirLatestStatus.filter(
      (tx) => tx.history?.[0]?.status === TransactionStatus.PENDING
    );
    console.log("Checking pending transactions", pendingTransactions);

    for (const transaction of pendingTransactions) {
      const resp = await getPaymentStatus(transaction.id);

      // Store the raw payment response JSON for debugging/audit purposes
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { paymentResultJSON: JSON.stringify(resp) },
      });

      // Extract the payment status
      let paymentState;
      if (process.env.NODE_ENV === NodeENV.PRODUCTION)
        paymentState = (resp as PaymentStatusCheckResponse).state;
      else
        paymentState = (resp as Sandbox_PaymentStatusCheckResponse).data.state;

      const order = transaction.order;
      const user = transaction.order?.user;
      const product = transaction.order?.product;

      if (!user || !product || !order) {
        throw new Error("Either of user, product or order are missing");
      }

      if (paymentState === PhonePayTransactionStates.COMPLETED) {
        await handlePaymentSuccess({
          transactionId: transaction.id,
          orderId: order.id,
          userId: user.id,
          duration: product.duration as Duration,
        });
      } else if (paymentState === PhonePayTransactionStates.PENDING) {
        await handlePaymentPending({
          transactionId: transaction.id,
        });
      } else {
        await handlePaymentFailed({
          transactionId: transaction.id,
        });
      }
    }
    return NextResponse.json(
      {
        success: true,
        data: pendingTransactions,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error upadting Payment Status", err);
    return NextResponse.json({
      success: false,
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
