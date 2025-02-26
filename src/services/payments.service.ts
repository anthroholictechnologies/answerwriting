import {
  CHECKSUM_ADDER,
  PHONE_PAY_PAYMENT_ENDPOINT,
} from "answerwriting/config";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import { PurchaseRequestPayload } from "answerwriting/types/payment.types";
import crypto from "crypto";

function generateRedirectURI({
  merchantTransactionId,
}: {
  merchantTransactionId: string;
}) {
  return `${process.env.APP_BASE_URI}${ApiRoutePaths.PAYMENTS_STATUS}?id=${merchantTransactionId}`;
}

function generateCheckSum(
  payloadBase64: string,
  saltKey: string,
  saltIndex: string,
): string {
  const fullUrl = `${payloadBase64}${PHONE_PAY_PAYMENT_ENDPOINT}${saltKey}`;
  const sha256 = crypto.createHash("sha256").update(fullUrl).digest("hex");
  return `${sha256}${CHECKSUM_ADDER}${saltIndex}`;
}

export async function initiatePayment({
  merchantTransactionId,
  merchantUserId,
  amountInPaisa,
}: {
  merchantTransactionId: string;
  merchantUserId: string;
  amountInPaisa: number;
}) {
  const redirectURI = generateRedirectURI({
    merchantTransactionId,
  });

  const payload: PurchaseRequestPayload = {
    merchantId: process.env.PHONE_PAY_MERCHANT_ID!,
    merchantTransactionId,
    merchantUserId,
    amountInPaisa,
    redirectUrl: redirectURI,
    callbackUrl: redirectURI,
    paymentInstrument: { type: "PAY_PAGE" },
    redirectMode: "POST",
  };

  const baseSixtyFourPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64",
  );
  const checkSum = generateCheckSum(
    baseSixtyFourPayload,
    process.env.PHONE_PAY_SALT_KEY!,
    process.env.PHONE_PAY_SALT_INDEX!,
  );

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

  return response.data;
}
