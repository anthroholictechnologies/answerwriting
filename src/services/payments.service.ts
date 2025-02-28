import {
  CHECKSUM_ADDER,
  PHONE_PAY_PAYMENT_ENDPOINT,
  PHONE_PAY_PAYMENT_STATUS_ENDPOINT,
} from "answerwriting/config";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import {
  Duration,
  PhonePePaymentInitiationResponse,
  PhonePePurchaseRequestPayload,
  SubscriptionStatus,
  TransactionStatus,
} from "answerwriting/types/payment.types";
import crypto from "crypto";
import axios from "axios";
import { prisma } from "answerwriting/prisma";
import { DateTime } from "luxon";

function generateRedirectURI({
  merchantTransactionId,
}: {
  merchantTransactionId: string;
}) {
  return `${process.env.APP_BASE_URI}${ApiRoutePaths.PAYMENTS_STATUS}?id=${merchantTransactionId}`;
}

const generateCheckSumForPaymentInitiation = (payloadBase64: string) =>
  `${crypto.createHash("sha256").update(`${payloadBase64}${PHONE_PAY_PAYMENT_ENDPOINT}${process.env.PHONE_PAY_SALT_KEY}`).digest("hex")}${CHECKSUM_ADDER}${process.env.PHONE_PAY_SALT_INDEX}`;

export async function initiatePayment({
  merchantTransactionId,
  merchantUserId,
  amountInPaisa,
}: {
  merchantTransactionId: string;
  merchantUserId: string;
  amountInPaisa: number;
}): Promise<PhonePePaymentInitiationResponse> {
  const redirectURI = generateRedirectURI({
    merchantTransactionId,
  });

  const payload: PhonePePurchaseRequestPayload = {
    merchantId: process.env.PHONE_PAY_MERCHANT_ID!,
    merchantTransactionId,
    merchantUserId,
    amount: amountInPaisa,
    redirectUrl: redirectURI,
    callbackUrl: redirectURI,
    paymentInstrument: { type: "PAY_PAGE" },
    redirectMode: "POST",
  };

  const baseSixtyFourPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64",
  );
  const checkSum = generateCheckSumForPaymentInitiation(baseSixtyFourPayload);

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-VERIFY": checkSum,
    "X-MERCHANT-ID": process.env.PHONE_PAY_MERCHANT_ID!,
  };

  const response = await axios.post(
    `${process.env.PHONE_PAY_BASE_URI}${PHONE_PAY_PAYMENT_ENDPOINT}`,
    { request: baseSixtyFourPayload },
    { headers },
  );

  const respData = <PhonePePaymentInitiationResponse>response.data;
  return respData;
}

const generateCheckSumForPaymentStatus = (merchantTransactionId: string) =>
  crypto
    .createHash("sha256")
    .update(
      `${PHONE_PAY_PAYMENT_STATUS_ENDPOINT}/${process.env.PHONE_PAY_MERCHANT_ID}/${merchantTransactionId}${process.env.PHONE_PAY_SALT_KEY}`,
    )
    .digest("hex") +
  CHECKSUM_ADDER +
  process.env.PHONE_PAY_SALT_INDEX;

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
export async function checkPaymentStatus({
  merchantTransactionId,
}: {
  merchantTransactionId: string;
}): Promise<unknown> {
  const checkSum = generateCheckSumForPaymentStatus(merchantTransactionId);
  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-VERIFY": checkSum,
    "X-MERCHANT-ID": process.env.PHONE_PAY_MERCHANT_ID,
  };

  const resp = await axios.get(
    `${process.env.PHONE_PAY_BASE_URI}${PHONE_PAY_PAYMENT_STATUS_ENDPOINT}/${process.env.PHONE_PAY_MERCHANT_ID}/${merchantTransactionId}`,
    { headers },
  );

  return resp.data;
}

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
    }
    case Duration.HALF_YEARLY: {
      expiryDate = activationDate.plus({ days: 180 }).toJSDate();
    }
    case Duration.QUATERLY: {
      expiryDate = activationDate.plus({ days: 90 }).toJSDate();
    }
    case Duration.MONTHLY: {
      expiryDate = activationDate.plus({ days: 30 }).toJSDate();
    }
  }
  // Update transaction history to COMPLETED
  await prisma.$transaction(async function (tx) {
    await tx.transactionStatusHistory.create({
      data: {
        transactionId,
        status: TransactionStatus.COMPLETED,
      },
    });

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
