import { TransactionStatus } from "@prisma/client";
import { prisma } from "answerwriting/prisma";
import {
  checkPaymentStatus,
  handlePaymentFailed,
  handlePaymentPending,
  handlePaymentSuccess,
} from "answerwriting/services/payments.service";
import {
  PhonePayStatusCheckAPIResponse,
  PhonePayTransactionStates,
} from "answerwriting/types/payment.types";

export async function POST() {
  const transactionsWithTheirLatestStatus = await prisma.transaction.findMany({
    include: {
      history: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const pendingTransactions = transactionsWithTheirLatestStatus.filter(
    (tx) => tx.history?.[0]?.status === TransactionStatus.PENDING
  );

  for (const transaction of pendingTransactions) {
    const resp = (await checkPaymentStatus({
      merchantTransactionId: transaction.id,
    })) as PhonePayStatusCheckAPIResponse;

    // Store the raw payment response JSON for debugging/audit purposes
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { paymentResultJSON: resp },
    });

    // Extract the payment status
    const paymentState = resp?.data?.state;

    if (paymentState === PhonePayTransactionStates.COMPLETED) {
      await handlePaymentSuccess({
        transactionId: transaction.id,
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
}
