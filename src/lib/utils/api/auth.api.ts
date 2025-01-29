import { ApiResponse, ApiRoutePaths } from "answerwriting/types/general.types";
import {
  RegistrationInput,
  VerifyEmailInput,
} from "answerwriting/validations/auth.schema";

export async function registerUser(
  data: RegistrationInput,
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

export async function verifyEmail(data: VerifyEmailInput) {
  const response = await fetch(ApiRoutePaths.VERIFY_EMAIL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}
