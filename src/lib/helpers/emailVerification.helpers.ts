import { v4 } from "uuid";
import { prisma } from "../prisma";
import { DateTime } from "luxon";
import {
  COMPANY_NAME,
  EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_HOURS,
  MAX_EMAIL_VERIFICATION_REQUEST_ALLOWED_IN_A_DAY,
} from "../config";
import SendVerificationEmailTemplate from "../../../emails/VerificationEmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createVerificationToken(userId: string) {
  const token = v4();
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

console.log(
  "====${process.env.BASE_URI}/logos/logo.png",
  `${process.env.BASE_URI}/logos/logo.png`,
);

// Helper function to send the verification email using Resened
export const sendEmailVerificationMail = async ({
  firstName,
  token,
  userId,
  emailTo,
}: {
  firstName: string;
  token: string;
  userId: string;
  emailTo: string;
}) => {
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM as string,
    to: [emailTo],
    subject: `Welcome to ${COMPANY_NAME} Please Verify Your Email`,
    react: SendVerificationEmailTemplate({
      firstName,
      verificationLink: `${process.env.API_BASE_URI}/auth/a=${userId}&b=${token}`,
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
