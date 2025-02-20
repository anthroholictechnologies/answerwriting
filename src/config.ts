import { ApiRoutePaths } from "answerwriting/types/general.types";
import {
  forgetPasswordSchema,
  registrationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "answerwriting/validations/auth.schema";
import { ZodSchema } from "zod";

export const apiRoutesWhichRequiresAuthentication: ApiRoutePaths[] = [
  ApiRoutePaths.PAGE_DASHBOARD,
  ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR,
  ApiRoutePaths.PAGE_DASHBOARD_USER_PROFILE,

  // API Routes
  ApiRoutePaths.EVALUATE_ANSWER,
  // Add routes here that require authentication
  //...
];
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

export const EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_MINUTES = 15;

export const FORGET_PASSWORD_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_MINUTES = 5;
export const MAX_FORGET_PASSWORD_REQUEST_ALLOWED_IN_A_DAY = 3;

export const COMPANY_NAME = "answerwriting.com";

export const COMPANY_EMAIL = "info@answerwriting.com";

export const TELEGRAM_URL = "https://t.me/answerwritingpro";
export const YOUTUBE_URL = "https://youtube.com/@answerwritingpro";
export const IG_URL = "https://instagram.com/answerwritingpro";
export const FACEBOOK_URL = "https://facebook.com/answerwritingpro";

export const MAX_PDF_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024;
export const SINGLE_IMAGE_UPLOAD_SIZE_BYTES = 1 * 1024 * 1024;
export const MAX_IMAGES_ALLOWED = 5;

// Asset paths
export const LOGO_BANNER_URI = `https://res.cloudinary.com/dc36fxbog/image/upload/v1737793645/logo_dnei0q.png`;
