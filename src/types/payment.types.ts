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
