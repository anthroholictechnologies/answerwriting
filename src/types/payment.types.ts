export enum PlanType {
  FREE = "FREE",
  PRO = "PRO",
}

export enum Duration {
  ANNUAL = "ANNUAL",
  HALF_YEARLY = "HALF_YEARLY",
  QUATERLY = "QUATERLY",
  MONTHLY = "MONTHLY",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface BillingOptions {
  id: string;
  duration: Duration;
  discountPercentage: number;
  totalPrice: number;
  planId: string;
}
export interface Plans {
  id: string;
  name: PlanType;
  billingOptions: BillingOptions[];
}

export interface PurchaseRequestPayload {
  merchantId: string;
  merchantTransactionId: string;
  // Always in paisa
  amountInPaisa: number;
  merchantUserId: string;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  paymentInstrument: {
    type: "PAY_PAGE";
  };
}

export interface InitiatePaymentResponse {
  paymentGatewayUrl: string;
}
