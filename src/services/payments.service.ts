import {
  Duration,
  SubscriptionStatus,
  TransactionStatus,
} from "answerwriting/types/payment.types";
import { prisma } from "answerwriting/prisma";
import { DateTime } from "luxon";
/*
      {
  "success": true,
  "code": "PAYMENT_SUCCESS",
  "message": "Your request has been successfully completed.",
  "data": {
    "merchantId": "PGTESTPAYUAT",
    "merchantTransactionId": "MT7850590068188104",
    "transactionId": "T2206202020325589144911",
    "amount": 100,
    "state": "COMPLETED",
    "responseCode": "SUCCESS",
    "paymentInstrument": {
      "type": "NETBANKING",
      "pgTransactionId": "1856982900",
      "pgServiceTransactionId": "PG2207281811271263274380",
      "bankTransactionId": null,
      "bankId": "SBIN"
    }
  }
}

  */
export const handlePaymentSuccess = async ({
  transactionId,
  orderId,
  userId,
  duration,
}: {
  transactionId: string;
  orderId: string;
  userId: string;
  duration: Duration;
}) => {
  const activationDate = DateTime.utc();
  let expiryDate = null;
  switch (duration) {
    case Duration.ANNUAL: {
      expiryDate = activationDate.plus({ days: 360 }).toJSDate();
      break;
    }
    case Duration.HALF_YEARLY: {
      expiryDate = activationDate.plus({ days: 180 }).toJSDate();
      break;
    }
    case Duration.QUATERLY: {
      expiryDate = activationDate.plus({ days: 90 }).toJSDate();
      break;
    }
    case Duration.MONTHLY: {
      expiryDate = activationDate.plus({ days: 30 }).toJSDate();
      break;
    }
    default: {
      throw new Error("Invalid duration");
    }
  }
  // Update transaction history to COMPLETED
  await prisma.$transaction(async function (tx) {
    const existingSubscription = await tx.subscription.findUnique({
      where: { orderId },
    });

    // This is to avoid race conditions
    if (!existingSubscription) {
      await tx.transactionStatusHistory.create({
        data: {
          transactionId,
          status: TransactionStatus.COMPLETED,
        },
      });
      // Create new subscription only if it doesn't exist
      await tx.subscription.create({
        data: {
          activationDate: DateTime.utc().toJSDate(),
          expiryDate,
          orderId,
          userId,
          history: {
            create: {
              status: SubscriptionStatus.ACTIVE,
            },
          },
        },
      });
    }
  });
};
export const handlePaymentPending = async ({
  transactionId,
}: {
  transactionId: string;
}) => {
  // Update transaction history to PENDING
  await prisma.transactionStatusHistory.create({
    data: {
      transactionId,
      status: TransactionStatus.PENDING,
    },
  });
};
export const handlePaymentFailed = async ({
  transactionId,
}: {
  transactionId: string;
}) => {
  // Update transaction history to FAILED
  await prisma.transactionStatusHistory.create({
    data: {
      transactionId,
      status: TransactionStatus.FAILED,
    },
  });
};
