export enum PlanType {
  FREE = "FREE",
  PRO = "PRO",
}

export enum Duration {
  ANNUAL = "ANNUAL",
  HALF_YEARLY = "HALF_YEARLY",
  QUATERLY = "QUARTERLY",
  MONTHLY = "MONTHLY",
}

export enum TransactionStatus {
  // Transaction is started when the user is at pay screen infront of the payment gateway
  STARTED = "STARTED",
  // Transaction is completed when the user pays for the order and payment is successfull
  COMPLETED = "COMPLETED",
  // Cancelled by the user, if user goes back from the gateway screen and creates a new order
  CANCELLED = "CANCELLED",
  // If the payment failes then the order is in the failed state
  FAILED = "FAILED",
  // If the payment is made and confirmation is pending from the user
  PENDING = "PENDING",
}

export enum SubscriptionStatus {
  // Cannot create new subscription
  ACTIVE = "ACTIVE",
  // Can create new subscription
  EXPIRED = "EXPIRED",
  // Can create new subscription
  CANCELLED = "CANCELLED",
}

export enum CancellationReason {
  NEW_ORDER_CREATED = "NEW_ORDER_CREATED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface Product {
  id: string;
  duration: Duration;
  discountPercentage: number;
  totalPrice: number;
  planId: string;
}
export interface Plans {
  id: string;
  name: PlanType;
  products: Product[];
}

// DO NOT CHANGE THIS, PROVIDED BY PHONEPAY
export interface PhonePePurchaseRequestPayload {
  merchantId: string;
  merchantTransactionId: string;
  // Always in paisa
  amount: number;
  merchantUserId: string;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  paymentInstrument: {
    type: "PAY_PAGE";
  };
}

export type PhonePePaymentInitiationResponse = {
  success: boolean;
  code: "PAYMENT_INITIATED";
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    instrumentResponse: {
      type: "PAY_PAGE";
      redirectInfo: {
        url: string;
        method: "POST";
      };
    };
  };
};

export enum PhonePayTransactionStates {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export type PhonePayStatusCheckAPIResponse = {
  data: {
    state: PhonePayTransactionStates;
  };
};

export interface InitiatePaymentResponse {
  paymentGatewayUrl: string;
}

export interface Subscription {
  id: string;
  subscriptionStatus: SubscriptionStatus;
}

export interface GetAuthTokenRequestPayload {
  client_id: string;
  client_version: string;
  client_secret: string;
  grant_type: "client_credentials";
}

export interface GetAuthTokenResponsePayload {
  access_token: string;
  encrypted_access_token: string;
  expires_in: number | null;
  issued_at: number;
  expires_at: number;
  session_expires_at: number;
  token_type: "O-Bearer";
}

export interface PaymentInitiationPayload {
  merchantOrderId: string;
  amount: number;
  paymentFlow: {
    type: "PG_CHECKOUT";
    merchantUrls: {
      redirectUrl: string;
    };
  };
}

export interface PaymentInitiationResponse {
  orderId: string;
  state: string;
  expireAt: number;
  redirectUrl: string;
}

export interface PaymentStatusCheckResponse {
  orderId: string;
  state: PhonePayTransactionStates;
  amount: string;
  expireAt: number;
}
