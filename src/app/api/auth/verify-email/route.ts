import { compareToken } from "answerwriting/lib/utils/token.utils";
import { isTokenExpired } from "answerwriting/services/email-verification.service";
import { prisma } from "answerwriting/prisma";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";
import { VerifyEmailInput } from "answerwriting/validations/auth.schema";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";

const ErrorResponses = {
  TAMPERED_URL: {
    success: false,
    errorCode: ErrorCodes.TAMPERED_EMAIL_VERIFICATION_URL,
    message: "The email verification URL is tampered or broken.",
  },
  EMAIL_EXPIRED: {
    success: false,
    errorCode: ErrorCodes.VERIFICATION_EMAIL_EXPIRED,
    message: "Verification email has expired. Please try again.",
  },
};

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const { a: userId, b: token } = (await request.json()) as VerifyEmailInput;
    // Fetch user and the latest token in a single query
    const userWithToken = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        emailVerificationTokens: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!userWithToken || !userWithToken.emailVerificationTokens.length) {
      return NextResponse.json(ErrorResponses.TAMPERED_URL, { status: 400 });
    }

    if (userWithToken.emailVerified) {
      return NextResponse.json({
        success: false,
        errorCode: ErrorCodes.EMAIL_ALREADY_VERIFIED,
        message: "Email is already verified.",
      });
    }

    const latestToken = userWithToken.emailVerificationTokens[0];

    // Check token expiry
    if (isTokenExpired(latestToken.expirationDate)) {
      return NextResponse.json(ErrorResponses.EMAIL_EXPIRED, { status: 400 });
    }

    // token comparison
    const isValidToken = compareToken(latestToken.token, token);

    if (!isValidToken) {
      return NextResponse.json(ErrorResponses.TAMPERED_URL, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { emailVerified: DateTime.utc().toJSDate() },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error(`Error verifying the user's email`, err);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
      },
      { status: 500 },
    );
  }
}
