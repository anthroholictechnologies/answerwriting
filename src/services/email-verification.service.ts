import { COMPANY_NAME } from "answerwriting/config";
import { prisma } from "answerwriting/prisma";
import { DateTime } from "luxon";
import { Resend } from "resend";
import SendVerificationEmailTemplate from "../../emails/email-verification.email.template";
import { ApiRoutePaths } from "answerwriting/types/general.types";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM as string,
    to: [emailTo],
    subject: `Welcome to ${COMPANY_NAME} Please Verify Your Email`,
    react: SendVerificationEmailTemplate({
      name: name,
      verificationLink: `${process.env.APP_BASE_URI}${ApiRoutePaths.PAGE_VERIFY_EMAIL}?a=${userId}&b=${token}`,
    }),
  });
};

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
