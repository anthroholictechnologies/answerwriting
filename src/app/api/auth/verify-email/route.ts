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

/*
 * get the token and the user id from the url
 * verify the user id check user exists
 *   - if user does not exist
 *       - throw invalid url error
 *   - else
 *      - check if token is valid
 *         - if token does not exist
 *             - throw invalid url error
 *         - else
 *             - grab the latest token for the user
 *             - check if the latest token is expired
 *                 - if token is expired
 *                      - throw email is expired
 *                 - else
 *                      - if token in url === latest token
 *                         - user verified
 *                      else
 *                         - throw invalid url
 */
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

    console.log("userWithToken=====", userWithToken);

    if (!userWithToken || !userWithToken.emailVerificationTokens.length) {
      return NextResponse.json(ErrorResponses.TAMPERED_URL, { status: 400 });
    }

    const latestToken = userWithToken.emailVerificationTokens[0];

    // Check token expiry
    if (isTokenExpired(latestToken.expirationDate)) {
      return NextResponse.json(ErrorResponses.EMAIL_EXPIRED, { status: 400 });
    }

    // Timing-safe token comparison
    const isValidToken = compareToken(latestToken.token, token);

    if (!isValidToken) {
      return NextResponse.json(ErrorResponses.TAMPERED_URL, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { emailVerified: DateTime.utc().toJSDate() },
      });
      await tx.emailVerificationToken.deleteMany({
        where: { userId },
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
