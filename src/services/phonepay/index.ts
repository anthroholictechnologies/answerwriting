import {
  getPaymentStatusURI,
  PAY_GET_TOKEN_URI,
  PAY_PAYMENT_INITIATION_URI,
  PHONE_PAY_PAYMENT_ENDPOINT,
  PHONE_PAY_PAYMENT_STATUS_ENDPOINT,
  SANDBOX_CHECKSUM_ADDER,
} from "answerwriting/config";
import { prisma } from "answerwriting/prisma";
import {
  GetAuthTokenRequestPayload,
  GetAuthTokenResponsePayload,
  PaymentInitiationPayload,
  PaymentInitiationResponse,
  PaymentStatusCheckResponse,
  Sandbox_PaymentStatusCheckResponse,
  Sandbox_PhonePePaymentInitiationResponse,
  Sandbox_PhonePePurchaseRequestPayload,
} from "answerwriting/types/payment.types";
import { DateTime } from "luxon";
import axios from "axios";
import { ApiRoutePaths, ENVNext } from "answerwriting/types/general.types";
import crypto from "crypto";

export async function getAuthToken(): Promise<string> {
  console.log("Request for generating phonepe auth token");
  const authTokens = await prisma.phonePeAuthToken.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  const latestAuthToken = authTokens?.[0];

  if (
    latestAuthToken &&
    DateTime.fromSeconds(latestAuthToken.expiresAt) > DateTime.now()
  ) {
    console.log("Valid auth token found in the database.");
    return latestAuthToken.accessToken;
  }

  const body: GetAuthTokenRequestPayload = {
    client_id: process.env.PAY_CLIENT_ID!,
    client_version: process.env.PAY_CLIENT_VERSION!,
    client_secret: process.env.PAY_CLIENT_SECRET!,
    grant_type: "client_credentials",
  };

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  console.log("Old auth token expired, requesting new token...");
  const response = await axios.post(
    `${process.env.PAY_BASE_AUTH_URL}${PAY_GET_TOKEN_URI}`,
    body,
    { headers }
  );

  const respData = response.data as GetAuthTokenResponsePayload;

  const newToken = await prisma.phonePeAuthToken.create({
    data: {
      accessToken: respData.access_token,
      expiresAt: respData.expires_at,
      encryptedAccessToken: respData.encrypted_access_token,
      tokenType: respData.token_type,
      sessionExpiresAt: respData.session_expires_at,
      issuedAt: respData.issued_at,
      expiresIn: respData.expires_in,
    },
  });

  console.log("returning fresh token");
  return newToken.accessToken;
}

function sandbox_GenerateRedirectURI({
  merchantTransactionId,
}: {
  merchantTransactionId: string;
}) {
  return `${process.env.APP_BASE_URI}${ApiRoutePaths.PAYMENTS_STATUS}?id=${merchantTransactionId}`;
}

const sandbox_GenerateCheckSumForPaymentInitiation = (payloadBase64: string) =>
  `${crypto.createHash("sha256").update(`${payloadBase64}${PHONE_PAY_PAYMENT_ENDPOINT}${process.env.PHONE_PAY_SALT_KEY}`).digest("hex")}${SANDBOX_CHECKSUM_ADDER}${process.env.PHONE_PAY_SALT_INDEX}`;

export async function sandbox_GetPaymentPage({
  merchantTransactionId,
  merchantUserId,
  amountInPaisa,
}: {
  merchantTransactionId: string;
  merchantUserId: string;
  amountInPaisa: number;
}): Promise<Sandbox_PhonePePaymentInitiationResponse> {
  const redirectURI = sandbox_GenerateRedirectURI({
    merchantTransactionId,
  });

  const payload: Sandbox_PhonePePurchaseRequestPayload = {
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
    "base64"
  );
  const checkSum =
    sandbox_GenerateCheckSumForPaymentInitiation(baseSixtyFourPayload);

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-VERIFY": checkSum,
    "X-MERCHANT-ID": process.env.PHONE_PAY_MERCHANT_ID!,
  };

  const response = await axios.post(
    `${process.env.PHONE_PAY_BASE_URI}${PHONE_PAY_PAYMENT_ENDPOINT}`,
    { request: baseSixtyFourPayload },
    { headers }
  );

  const respData = <Sandbox_PhonePePaymentInitiationResponse>response.data;
  return respData;
}

export async function getPaymentPage({
  merchantOrderId,
  amount,
  merchantUserId,
}: {
  merchantOrderId: string;
  amount: number;
  merchantUserId: string;
}): Promise<
  PaymentInitiationResponse | Sandbox_PhonePePaymentInitiationResponse
> {
  console.log("NODE ENV", process.env.NODE_ENV);
  console.log("ENV_NEXT", process.env.ENV_NEXT);
  if (process.env.ENV_NEXT !== ENVNext.PRODUCTION) {
    return sandbox_GetPaymentPage({
      merchantTransactionId: merchantOrderId,
      amountInPaisa: amount,
      merchantUserId: merchantUserId,
    });
  }

  const authToken = await getAuthToken();

  const headers = {
    Authorization: `O-Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const body: PaymentInitiationPayload = {
    merchantOrderId,
    amount,
    paymentFlow: {
      type: "PG_CHECKOUT",
      merchantUrls: {
        redirectUrl: `${process.env.APP_BASE_URI}${ApiRoutePaths.PAYMENTS_STATUS}?id=${merchantOrderId}`,
      },
    },
  };

  const response = await axios.post(
    `${process.env.PAY_BASE_PAYMENT_URL}${PAY_PAYMENT_INITIATION_URI}`,
    body,
    { headers }
  );

  const respData = response.data as PaymentInitiationResponse;

  return respData;
}

const sandbox_GenerateCheckSumForPaymentStatus = (
  merchantTransactionId: string
) =>
  crypto
    .createHash("sha256")
    .update(
      `${PHONE_PAY_PAYMENT_STATUS_ENDPOINT}/${process.env.PHONE_PAY_MERCHANT_ID}/${merchantTransactionId}${process.env.PHONE_PAY_SALT_KEY}`
    )
    .digest("hex") +
  SANDBOX_CHECKSUM_ADDER +
  process.env.PHONE_PAY_SALT_INDEX;

export async function sandbox_GetPaymentStatus({
  merchantTransactionId,
}: {
  merchantTransactionId: string;
}): Promise<Sandbox_PaymentStatusCheckResponse> {
  const checkSum = sandbox_GenerateCheckSumForPaymentStatus(
    merchantTransactionId
  );
  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-VERIFY": checkSum,
    "X-MERCHANT-ID": process.env.PHONE_PAY_MERCHANT_ID,
  };

  const resp = await axios.get(
    `${process.env.PHONE_PAY_BASE_URI}${PHONE_PAY_PAYMENT_STATUS_ENDPOINT}/${process.env.PHONE_PAY_MERCHANT_ID}/${merchantTransactionId}`,
    { headers }
  );

  return resp.data as Sandbox_PaymentStatusCheckResponse;
}
export async function getPaymentStatus(
  merchantOrderId: string
): Promise<PaymentStatusCheckResponse | Sandbox_PaymentStatusCheckResponse> {
  if (process.env.ENV_NEXT !== ENVNext.PRODUCTION) {
    return sandbox_GetPaymentStatus({ merchantTransactionId: merchantOrderId });
  }
  console.log("Checking in the payment status");
  const authToken = await getAuthToken();

  const headers = {
    Authorization: `O-Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const response = await axios.get(
    `${process.env.PAY_BASE_PAYMENT_URL}${getPaymentStatusURI(merchantOrderId)}`,
    { headers }
  );

  const respData = response.data as PaymentStatusCheckResponse;

  return respData;
}
