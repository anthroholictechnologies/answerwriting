import {
  getPaymentStatusURI,
  PAY_GET_TOKEN_URI,
  PAY_PAYMENT_INITIATION_URI,
} from "answerwriting/config";
import { prisma } from "answerwriting/prisma";
import {
  GetAuthTokenRequestPayload,
  GetAuthTokenResponsePayload,
  PaymentInitiationPayload,
  PaymentInitiationResponse,
  PaymentStatusCheckResponse,
} from "answerwriting/types/payment.types";
import { DateTime } from "luxon";
import axios from "axios";
import { ApiRoutePaths } from "answerwriting/types/general.types";

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
    { headers },
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

export async function getPaymentPage({
  merchantOrderId,
  amount,
}: {
  merchantOrderId: string;
  amount: number;
}): Promise<PaymentInitiationResponse> {
  console.log("Redirecting to the payment page");
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
    { headers },
  );

  const respData = response.data as PaymentInitiationResponse;

  console.log("respData=======", respData);

  return respData;
}

export async function getPaymentStatus(
  merchantOrderId: string,
): Promise<PaymentStatusCheckResponse> {
  console.log("Checking in the payment status");
  const authToken = await getAuthToken();

  const headers = {
    Authorization: `O-Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const response = await axios.get(
    `${process.env.PAY_BASE_PAYMENT_URL}${getPaymentStatusURI(merchantOrderId)}`,
    { headers },
  );

  const respData = response.data as PaymentStatusCheckResponse;

  return respData;
}
