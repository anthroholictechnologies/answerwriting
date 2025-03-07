import { ApiRoutePaths, Feature } from "answerwriting/types/general.types";
import {
  forgetPasswordSchema,
  registrationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "answerwriting/validations/auth.schema";
import { ZodSchema } from "zod";
import { purchaseSchema } from "./validations/payment.schema";

export const apiRoutesWhichRequiresAuthentication: ApiRoutePaths[] = [
  ApiRoutePaths.PAGE_DASHBOARD,
  ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR,
  ApiRoutePaths.PAGE_DASHBOARD_USER_PROFILE,

  // API Routes
  ApiRoutePaths.EVALUATE_ANSWER,
  // PAYMENT
  ApiRoutePaths.PAYMENTS_PURCHASE,
];
export const apiRoutesWhichRequiresValidations: ApiRoutePaths[] = [
  ApiRoutePaths.REGISTER,
  ApiRoutePaths.VERIFY_EMAIL,
  ApiRoutePaths.FORGET_PASSWORD,
  ApiRoutePaths.RESET_PASSWORD,
  ApiRoutePaths.PAYMENTS_PURCHASE,
];

export const apiRoutesSchemaMapping: Partial<{
  [key in ApiRoutePaths]: ZodSchema;
}> = {
  [ApiRoutePaths.REGISTER]: registrationSchema,
  [ApiRoutePaths.VERIFY_EMAIL]: verifyEmailSchema,
  [ApiRoutePaths.FORGET_PASSWORD]: forgetPasswordSchema,
  [ApiRoutePaths.RESET_PASSWORD]: resetPasswordSchema,
  [ApiRoutePaths.PAYMENTS_PURCHASE]: purchaseSchema,
};

export const EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_MINUTES = 15;

export const FORGET_PASSWORD_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_MINUTES = 5;
export const MAX_FORGET_PASSWORD_REQUEST_ALLOWED_IN_A_DAY = 3;

export const COMPANY_NAME = "answerwriting.com";

export const COMPANY_EMAIL = "info@answerwriting.com";
export const COMPANY_PHONE_NUMBER = "+917303290503";

export const TELEGRAM_URL = "https://t.me/answerwritingpro";
export const YOUTUBE_URL = "https://youtube.com/@answerwritingpro";
export const IG_URL = "https://instagram.com/answerwritingpro";
export const FACEBOOK_URL = "https://facebook.com/answerwritingpro";

export const MAX_PDF_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024;
export const MAX_PDF_NUM_PAGES = 5;
export const SINGLE_IMAGE_UPLOAD_SIZE_BYTES = 1 * 1024 * 1024;
export const MAX_IMAGES_ALLOWED = 5;
export const MAX_PAYLOAD_SIZE = 4.5 * 1024 * 1024;

// Asset paths
export const LOGO_BANNER_URI = `https://res.cloudinary.com/dc36fxbog/image/upload/v1737793645/logo_dnei0q.png`;

// Payment
export const PHONE_PAY_PAYMENT_ENDPOINT = "/pg/v1/pay";
export const PHONE_PAY_PAYMENT_STATUS_ENDPOINT = "/pg/v1/status";
export const PAY_GET_TOKEN_URI = "/v1/oauth/token";
export const PAY_PAYMENT_INITIATION_URI = "/checkout/v2/pay";

export const SANDBOX_CHECKSUM_ADDER = "###";
export const getPaymentStatusURI = (merchantOrderId: string) =>
  `/checkout/v2/order/${merchantOrderId}/status`;

export const freeFeatures: Feature[] = [
  {
    description: "Evaluate 1 answer every month",
    available: true,
    tooltip: "You can submit one answer each month for AI evaluation.",
  },
  {
    description: "Get instant AI-powered feedback",
    available: true,
    tooltip: "Receive AI-generated feedback immediately after submission.",
  },
  {
    description: "Get Improved Model Answer",
    available: true,
    tooltip: "Access a refined model answer based on your submission.",
  },
  {
    description: "Human Expert Feedback",
    available: false,
    tooltip: "Upgrade to a premium plan for expert feedback.",
  },
  {
    description: "Answers saved forever",
    available: false,
    tooltip:
      "Free-tier answers are stored temporarily. Upgrade to save them permanently.",
  },
];
export const proFeatures: Feature[] = [
  {
    description: "Unlimited AI Answer Evaluations",
    tooltip: "Get instant feedback on as many answers as you want.",
    available: true,
  },
  {
    description: "Human Expert Feedback",
    tooltip: "Get feedback from UPSC subject experts.",
    available: true,
  },
  {
    description: "Saved Answers Forever",
    tooltip: "Access your past evaluations anytime.",
    available: true,
  },
  {
    description: "Advanced Answer Insights",
    tooltip: "In-depth analysis to improve structure, coherence, and content.",
    available: true,
  },
  {
    description: "Exclusive Writing Tips",
    tooltip: "AI-powered suggestions to refine your answers.",
    available: true,
  },
  {
    description: "Priority Support",
    tooltip: "Faster responses and assistance whenever you need.",
    available: true,
  },
];
