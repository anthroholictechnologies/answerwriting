import {
  forgetPasswordSchema,
  registrationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "answerwriting/validations/authSchema";
import { ZodSchema } from "zod";

export enum ApiRoutePaths {
  REGISTER = "/api/auth/register",
  VERIFY_EMAIL = "/api/auth/verify-email",
  FORGET_PASSWORD = "/api/auth/forget-password",
  RESET_PASSWORD = "/api/auth/reset-password",
  LOGIN = "/api/auth/signin/credentials",
}

export const apiRoutesWhichRequiresValidations: ApiRoutePaths[] = [
  ApiRoutePaths.REGISTER,
  ApiRoutePaths.VERIFY_EMAIL,
  ApiRoutePaths.FORGET_PASSWORD,
  ApiRoutePaths.RESET_PASSWORD,
];

export const apiRoutesSchemaMapping: Partial<{
  [key in ApiRoutePaths]: ZodSchema;
}> = {
  [ApiRoutePaths.REGISTER]: registrationSchema,
  [ApiRoutePaths.VERIFY_EMAIL]: verifyEmailSchema,
  [ApiRoutePaths.FORGET_PASSWORD]: forgetPasswordSchema,
  [ApiRoutePaths.RESET_PASSWORD]: resetPasswordSchema,
};

export enum ErrorCodes {
  BAD_REQUEST_EXCEPTION = "BadRequestException",
  EMAIL_CONFLICT_EXCEPTION = "EmailConflictException",
  INTERNAL_SERVER_ERROR = "InternalServerError",
  TOO_MANY_VERIFICATION_EMAILS_SENT = "TooManyVerificationEmailsSent",
  VERIFICATION_EMAIL_PENDING = "VerificationEmailPending",
  VERIFICATION_EMAIL_EXPIRED = "VerificationEmailExpired",
  TAMPERED_EMAIL_VERIFICATION_URL = "TamperedEmailVerificationUrl",
  USER_NOT_FOUND = "UserNotFound",
  TOO_MANY_RESET_PASSWORD_ATTEMPTS = "TooManyResetPasswordAttempts",
  RESET_PASSWORD_LINK_ALREADY_SENT = "ResetPasswordLinkAlreadySent",
  TAMPERED_RESET_PASSWORD_URL = "TamperedResetPasswordUrl",
  RESET_PASSWORD_LINK_EXPIRED = "ResetPasswordLinkExpired",
}
// Define the generic API response type
export interface ApiResponse<T = unknown> {
  success: boolean; // Required
  errorCode?: ErrorCodes; // Optional, required when success is false
  message: string; // Required
  data?: T; // Optional, generic type for response data
}

export const EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_HOURS = 3;
export const MAX_EMAIL_VERIFICATION_REQUEST_ALLOWED_IN_A_DAY = 3;

export const FORGET_PASSWORD_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_MINUTES = 5;
export const MAX_FORGET_PASSWORD_REQUEST_ALLOWED_IN_A_DAY = 3;

export const COMPANY_NAME = "answerwriting.com";

export const LOGO_BANNER_URI = `https://res.cloudinary.com/dc36fxbog/image/upload/v1737793645/logo_dnei0q.png`;
