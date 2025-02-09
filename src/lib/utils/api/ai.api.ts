import { ApiResponse, ApiRoutePaths } from "answerwriting/types/general.types";
import { EvaluateAnswerAPIResponse } from "answerwriting/validations/ai.schema";

export async function evaluateAnswer(
  data: FormData,
): Promise<ApiResponse<EvaluateAnswerAPIResponse>> {
  const response = await fetch(ApiRoutePaths.EVALUATE_ANSWER, {
    method: "POST",
    body: data,
  });

  return await response.json();
}
