"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "./auth";
import { LoginInput } from "./validations/auth.schema";
import { ApiResponse, ErrorCodes } from "./types/general.types";

export const logout = async () => {
  console.log("User loggin out of the universe");
  return signOut({ redirectTo: "/auth/login" });
};
export const signInWithGoogle = async () => {
  return signIn("google", { redirectTo: "/dashboard" });
};

export const signInWithCredentials = async ({
  email,
  password,
}: LoginInput): Promise<ApiResponse> => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Logged in successfully",
    };
  } catch (err: unknown) {
    if (err instanceof AuthError) {
      if (err.type === "CredentialsSignin") {
        return {
          success: false,
          errorCode: ErrorCodes.INVALID_CREDENTIALS,
          message: "Incorrect username or password.",
        };
      } else if (err.cause?.err?.message === ErrorCodes.USER_NOT_FOUND) {
        return {
          success: false,
          errorCode: ErrorCodes.USER_NOT_FOUND,
          message: "User not found.",
        };
      } else if (
        err.cause?.err?.message === ErrorCodes.ALREADY_REGISTERED_WITH_GOOGLE
      ) {
        return {
          success: false,
          errorCode: ErrorCodes.ALREADY_REGISTERED_WITH_GOOGLE,
          message: "User already registered with Google.",
        };
      } else {
        return {
          success: false,
          errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
          message: "Internal server error.",
        };
      }
    } else {
      return {
        success: false,
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: "Internal server error.",
      };
    }
  }
};
