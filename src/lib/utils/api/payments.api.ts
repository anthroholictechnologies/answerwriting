import { ApiResponse, ApiRoutePaths } from "answerwriting/types/general.types";
import { InitiatePaymentResponse } from "answerwriting/types/payment.types";
import { PurchaseInput } from "answerwriting/validations/payment.schema";

export async function upgradeToPro(
  data: PurchaseInput,
): Promise<ApiResponse<InitiatePaymentResponse>> {
  const response = await fetch(ApiRoutePaths.PAYMENTS_PURCHASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}
