import { ErrorCodes } from "answerwriting/lib/config";
import { isTokenExpired } from "answerwriting/lib/helpers/resetPassword.helpers";
import { prisma } from "answerwriting/lib/prisma";
import { ResetPasswordInput } from "answerwriting/validations/authSchema";
import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const ErrorResponses = {
  TAMPERED_URL: {
    success: false,
    errorCode: ErrorCodes.TAMPERED_RESET_PASSWORD_URL,
    message: "The reset password URL is tampered or broken.",
  },
  EMAIL_EXPIRED: {
    success: false,
    errorCode: ErrorCodes.RESET_PASSWORD_LINK_EXPIRED,
    message: "Reset password link has expired. Please try again.",
  },
};
export async function POST(req: Request) {
  const {
    a: userId,
    b: token,
    c: newPassword,
  } = (await req.json()) as ResetPasswordInput;

  const userWithToken = await prisma.user.findFirst({
    where: { id: userId, emailVerified: { not: { equals: null } } },
    include: {
      forgetPasswordTokens: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!userWithToken || !userWithToken.forgetPasswordTokens.length) {
    return NextResponse.json(ErrorResponses.TAMPERED_URL, { status: 400 });
  }

  const latestToken = userWithToken.forgetPasswordTokens[0];

  if (isTokenExpired(latestToken.expirationDate)) {
    return NextResponse.json(ErrorResponses.EMAIL_EXPIRED, { status: 400 });
  }

  const isValidToken = timingSafeEqual(
    Buffer.from(token),
    Buffer.from(latestToken.token),
  );

  if (!isValidToken) {
    return NextResponse.json(ErrorResponses.TAMPERED_URL, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    await tx.forgetPasswordToken.deleteMany({
      where: { userId },
    });
  });

  return NextResponse.json(
    {
      success: true,
      message: "Password updated successfully",
    },
    { status: 200 },
  );
}
