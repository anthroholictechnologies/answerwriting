import { ApiResponse, ApiRoutePaths } from "answerwriting/types/general.types";
import {
  ForgetPasswordInput,
  RegistrationInput,
  ResetPasswordInput,
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

export async function forgetPassword(data: ForgetPasswordInput) {
  const response = await fetch(ApiRoutePaths.FORGET_PASSWORD, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function resetPassword(
  data: ResetPasswordInput,
): Promise<ApiResponse> {
  const response = await fetch(ApiRoutePaths.RESET_PASSWORD, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}
