"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "./auth";
import { LoginInput } from "./validations/auth.schema";
import { ApiResponse, ApiRoutePaths, ErrorCodes } from "./types/general.types";
import { ContactInput } from "./validations/general.schema";
import { Resend } from "resend";
import ContactEmail from "../emails/contactus.email.template";

export const logout = async () => {
  return signOut({ redirectTo: ApiRoutePaths.PAGE_LOGIN });
};
export const signInWithGoogle = async () => {
  return signIn("google", { redirectTo: ApiRoutePaths.PAGE_DASHBOARD });
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

const resend = new Resend(process.env.RESEND_API_KEY);
export const SendContactUsEmail = async (data: ContactInput) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM as string,
      to: process.env.RESEND_EMAIL_FROM as string,
      subject: `📩 New Contact Form Submission from ${data.name}`,
      react: ContactEmail({
        email: data.email,
        message: data.message,
        name: data.name,
        phone: data.phone,
      }),
    });
  } catch (err) {
    console.error(err);
    return {
      success: false,
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: "Error sending contact us email",
    };
  }
};
