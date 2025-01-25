import { registrationSchema } from "answerwriting/validations/authSchema";

export enum ApiRoutePaths {
  REGISTER = "/api/auth/register",
}

export const apiRoutesWhichRequiresValidations: ApiRoutePaths[] = [
  ApiRoutePaths.REGISTER,
];

export const apiRoutesSchemaMapping = {
  [ApiRoutePaths.REGISTER]: registrationSchema,
};

export enum ErrorCodes {
  BAD_REQUEST_EXCEPTION = "BadRequestException",
  EMAIL_CONFLICT_EXCEPTION = "EmailConflictException",
  INTERNAL_SERVER_ERROR = "InternalServerError",
  TOO_MANY_VERIFICATION_EMAILS_SENT = "TooManyVerificationEmailsSent",
  VERIFICATION_EMAIL_PENDING = "VerificationEmailPending",
}
// Define the generic API response type
export type ApiResponse<T = unknown> = {
  success: boolean; // Required
  errorCode?: ErrorCodes; // Optional, required when success is false
  message: string; // Required
  data?: T; // Optional, generic type for response data
};

export const EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_HOURS = 3;
export const MAX_EMAIL_VERIFICATION_REQUEST_ALLOWED_IN_A_DAY = 3;
export const COMPANY_NAME = "answerwriting.com";

export const LOGO_BANNER_URI = `https://res.cloudinary.com/dc36fxbog/image/upload/v1737793645/logo_dnei0q.png`;
