import {
  COMPANY_NAME,
  FORGET_PASSWORD_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_MINUTES,
  MAX_FORGET_PASSWORD_REQUEST_ALLOWED_IN_A_DAY,
} from "answerwriting/config";
import { prisma } from "answerwriting/prisma";
import { generateToken } from "answerwriting/lib/utils/token.utils";
import { DateTime } from "luxon";
import { Resend } from "resend";
import ForgetPasswordEmailTemplate from "../../emails/ForgetPasswordEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createForgetPasswordToken(userId: string) {
  const token = generateToken();
  await prisma.forgetPasswordToken.create({
    data: {
      userId,
      token,
      expirationDate: DateTime.utc()
        .plus({
          minutes:
            FORGET_PASSWORD_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_MINUTES,
        })
        .toJSDate(),
    },
  });
  return token;
}

// Helper function to send the verification email using Resened
export const sendForgetPasswordMail = async ({
  name,
  token,
  userId,
  emailTo,
}: {
  name: string;
  token: string;
  userId: string;
  emailTo: string;
}) => {
  if (process.env.NODE_ENV === "development") {
    return;
  }
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM as string,
    to: [emailTo],
    subject: `Reset your password for ${COMPANY_NAME}`,
    react: ForgetPasswordEmailTemplate({
      name,
      resetLink: `${process.env.APP_BASE_URI}/auth/reset-password?a=${userId}&b=${token}`,
    }),
  });
};

export async function hasTooManyForgetPasswordAttempts(userId: string) {
  const verificationEmailCount = await prisma.forgetPasswordToken.count({
    where: {
      userId,
      createdAt: { gte: DateTime.utc().minus({ hours: 24 }).toJSDate() },
    },
  });
  return verificationEmailCount >= MAX_FORGET_PASSWORD_REQUEST_ALLOWED_IN_A_DAY;
}

export async function getLatestForgetPasswordToken(userId: string) {
  return await prisma.forgetPasswordToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function isTokenExpired(tokenExpiryTime: Date) {
  return (
    DateTime.fromJSDate(tokenExpiryTime, { zone: "utc" }) <
    DateTime.now().toUTC()
  );
}
