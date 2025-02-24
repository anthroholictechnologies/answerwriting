import { ApiResponse, ApiRoutePaths } from "answerwriting/types/general.types";
import { PurchaseInput } from "answerwriting/validations/payment.schema";

export async function upgradeToPro(data: PurchaseInput): Promise<ApiResponse> {
  const response = await fetch(ApiRoutePaths.UPGRADE_TO_PRO, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}
