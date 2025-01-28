import { ApiResponse, ApiRoutePaths } from "answerwriting/types/general.types";
import { RegistrationInput } from "answerwriting/validations/auth.schema";

export async function registerUser(
  data: RegistrationInput
): Promise<ApiResponse> {
  const response = await fetch(ApiRoutePaths.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  return await response.json();
}
