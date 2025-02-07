export enum ApiRoutePaths {
  REGISTER = "/api/auth/register",
  VERIFY_EMAIL = "/api/auth/verify-email",
  FORGET_PASSWORD = "/api/auth/forget-password",
  RESET_PASSWORD = "/api/auth/reset-password",
  EVALUATE_ANSWER = "/api/ai/evaluate-answer",

  // misc
  PAGE_HOME = "/",
  PAGE_ABOUT_US = "/about",
  PAGE_CONTACT_US = "/contact",
  PAGE_PRIVACY_POLICY = "/privacy-policy",
  PAGE_TERMS_OF_SERVICE = "/terms",
  PAGE_BLOGS = "/blog",

  // auth user pages
  PAGE_DASHBOARD = "/dashboard",

  // auth
  PAGE_LOGIN = "/auth/login",
  PAGE_REGISTER = "/auth/register",

  //pricing
  PAGE_PRICING = "/pricing",
}

export enum ErrorCodes {
  BAD_REQUEST_EXCEPTION = "BadRequestException",
  EMAIL_CONFLICT_EXCEPTION = "EmailConflictException",
  RESENT_VERIFICATION_EMAIL = "ResendVerificationEmail",
  INTERNAL_SERVER_ERROR = "InternalServerError",
  VERIFICATION_EMAIL_PENDING = "VerificationEmailPending",
  VERIFICATION_EMAIL_EXPIRED = "VerificationEmailExpired",
  EMAIL_ALREADY_VERIFIED = "EmailAlreadyVerified",
  TAMPERED_EMAIL_VERIFICATION_URL = "TamperedEmailVerificationUrl",
  USER_NOT_FOUND = "UserNotFound",
  TOO_MANY_RESET_PASSWORD_ATTEMPTS = "TooManyResetPasswordAttempts",
  RESET_PASSWORD_LINK_ALREADY_SENT = "ResetPasswordLinkAlreadySent",
  TAMPERED_RESET_PASSWORD_URL = "TamperedResetPasswordUrl",
  RESET_PASSWORD_LINK_EXPIRED = "ResetPasswordLinkExpired",

  INVALID_CREDENTIALS = "InvalidCredentials",
  ALREADY_REGISTERED_WITH_GOOGLE = "AlreadyRegisteredWithGoogle",
}

export interface ApiResponse<T = unknown> {
  success: boolean; // Required
  errorCode?: ErrorCodes; // Optional, required when success is false
  message: string; // Required
  data?: T; // Optional, generic type for response data
}

export interface AuthenticatedUser {
  email: string;
  name: string | null;
  id: string;
  emailVerified: Date | null;
  image: string | null;
}
