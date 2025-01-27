import {
  COMPANY_NAME,
  EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_HOURS,
  MAX_EMAIL_VERIFICATION_REQUEST_ALLOWED_IN_A_DAY,
} from "answerwriting/config";
import { prisma } from "answerwriting/prisma";
import { generateToken } from "answerwriting/lib/utils/token.utils";
import { DateTime } from "luxon";
import { Resend } from "resend";
import SendVerificationEmailTemplate from "../../emails/VerificationEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createVerificationToken(userId: string) {
  const token = generateToken();
  await prisma.emailVerificationToken.create({
    data: {
      userId,
      token,
      expirationDate: DateTime.utc()
        .plus({ hours: EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_HOURS })
        .toJSDate(),
    },
  });
  return token;
}

// Helper function to send the verification email using Resened
export const sendEmailVerificationMail = async ({
  name: name,
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
    subject: `Welcome to ${COMPANY_NAME} Please Verify Your Email`,
    react: SendVerificationEmailTemplate({
      name: name,
      verificationLink: `${process.env.APP_BASE_URI}/auth/verify-email?a=${userId}&b=${token}`,
    }),
  });
};

export async function hasTooManyVerificationEmails(userId: string) {
  const verificationEmailCount = await prisma.emailVerificationToken.count({
    where: {
      userId,
      createdAt: { gte: DateTime.utc().minus({ hours: 24 }).toJSDate() },
    },
  });
  return (
    verificationEmailCount >= MAX_EMAIL_VERIFICATION_REQUEST_ALLOWED_IN_A_DAY
  );
}

export async function getLatestVerificationToken(userId: string) {
  return await prisma.emailVerificationToken.findFirst({
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
