import {
  createForgetPasswordToken,
  getLatestForgetPasswordToken,
  hasTooManyForgetPasswordAttempts,
  isTokenExpired,
  sendForgetPasswordMail,
} from "answerwriting/services/resetPassword.service";
import { prisma } from "answerwriting/prisma";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";
import { ForgetPasswordInput } from "answerwriting/validations/authSchema";
import { NextRequest, NextResponse } from "next/server";

/*
 * High level logic
 * Check if the user with email already exists
 *     - if no user found
 *         - throw please register first error
 *     - if user found
 *        - If user is not verified
 *           - Email verification pending error
 *         else -
 *            - check the latest forget password token
 *                - if not expired then
 *                    - reset password link already sent
 *                - else
 *                    - if too many attempts made
 *                      - too many attempts
 *                    - else
 *                      - send reset password email
 *            else
 *                   - send reset password email
 */
export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const { email } = (await req.json()) as ForgetPasswordInput;

    const userExistsWithEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (!userExistsWithEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Please register first",
          errorCode: ErrorCodes.USER_NOT_FOUND,
        },
        { status: 400 },
      );
    }

    if (!userExistsWithEmail.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email id first.",
          errorCode: ErrorCodes.VERIFICATION_EMAIL_PENDING,
        },
        { status: 400 },
      );
    }

    const latestForgetPasswordToken = await getLatestForgetPasswordToken(
      userExistsWithEmail.id,
    );

    if (latestForgetPasswordToken) {
      if (isTokenExpired(latestForgetPasswordToken.expirationDate)) {
        if (await hasTooManyForgetPasswordAttempts(userExistsWithEmail.id)) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Too many reset password attempts! Please try again after some time.",
              errorCode: ErrorCodes.TOO_MANY_RESET_PASSWORD_ATTEMPTS,
            },
            { status: 429 },
          );
        } else {
          const token = await createForgetPasswordToken(userExistsWithEmail.id);
          await sendForgetPasswordMail({
            emailTo: userExistsWithEmail.email,
            name: userExistsWithEmail.name as string,
            userId: userExistsWithEmail.id,
            token,
          });

          return NextResponse.json({
            message: `We've sent you the password reset email.`,
            success: true,
          });
        }
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Reset password email already sent",
            errorCode: ErrorCodes.RESET_PASSWORD_LINK_ALREADY_SENT,
          },
          { status: 409 },
        );
      }
    }

    const token = await createForgetPasswordToken(userExistsWithEmail.id);
    await sendForgetPasswordMail({
      emailTo: userExistsWithEmail.email,
      name: userExistsWithEmail.name as string,
      userId: userExistsWithEmail.id,
      token,
    });

    return NextResponse.json({
      message: `We've sent you the password reset email.`,
      success: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    return NextResponse.json({
      message: "Something went wrong!! Interal server error",
      success: false,
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
