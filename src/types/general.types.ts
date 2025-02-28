export enum ApiRoutePaths {
  // API

  // Authentication
  REGISTER = "/api/auth/register",
  VERIFY_EMAIL = "/api/auth/verify-email",
  FORGET_PASSWORD = "/api/auth/forget-password",
  RESET_PASSWORD = "/api/auth/reset-password",

  // Tools
  EVALUATE_ANSWER = "/api/ai/evaluate-answer",

  // Payment
  PAYMENTS_PURCHASE = "/api/payments/purchase",
  PAYMENTS_STATUS = "/api/payments/status",

  // Pages
  // misc
  PAGE_HOME = "/",
  PAGE_ABOUT_US = "/about",
  PAGE_CONTACT_US = "/contact",
  PAGE_PRIVACY_POLICY = "/privacy",
  PAGE_TERMS_OF_SERVICE = "/terms",
  PAGE_BLOGS = "/blog",
  PAGE_REFUND_PLOCIY = "/refund",
  PAGE_FAQ = "/faq",

  //dashboard
  PAGE_DASHBOARD = "/dashboard",

  // Profile
  PAGE_DASHBOARD_USER_PROFILE = "/me",

  // Tools
  PAGE_DASHBOARD_TOOLS_EVALUATOR = "/evaluator",
  PAGE_DASHBOARD_TOOLS_WORD_COUNTER = "/wordcounter",

  // auth
  PAGE_LOGIN = "/login",
  PAGE_REGISTER = "/register",
  PAGE_VERIFY_EMAIL = "/verify-email",
  PAGE_FORGET_PASSWORD = "/forget-password",
  PAGE_RESET_PASSWORD = "/reset-password",

  //pricing
  PAGE_PRICING = "/pricing",
  PAGE_UPGRADE = "/upgrade",
  PAGE_PAYMENT_STATUS = "/payment-status",
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

  ALREADY_SUBSCRIBED = "AlreadySubscribed",

  UNAUTHORIZED = "Unauthorized",

  PRODUCT_NOT_FOUND = "ProductNotFound",
  ORDER_ALREADY_PENDING = "OrderAlreadyPending",

  USER_ALREADY_HAS_ACTIVE_SUBSCRIPTION = "UserAlreadyHasActiveSubscription",
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
  password: string | null;
}
