import { EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_MINUTES } from "answerwriting/config";
import { prisma } from "answerwriting/prisma";
import { RegistrationInput } from "answerwriting/validations/auth.schema";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailVerificationMail } from "answerwriting/services/email-verification.service";
import { DateTime } from "luxon";
import { generateToken } from "answerwriting/lib/utils/token.utils";
import { hashPassword } from "answerwriting/lib/utils/password.utils";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    // Parse the request body the body is validated by zod
    const body = (await request.json()) as RegistrationInput;
    const { email, password, name } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (existingUser.emailVerified) {
        // If there is already a verified user with this email then return error.
        return NextResponse.json(
          {
            success: false,
            message: `User already exists with email ${email}`,
            errorCode: ErrorCodes.EMAIL_CONFLICT_EXCEPTION,
          },
          { status: 409 }
        );
      } else {
        // If the user is unverfied and is again registering
        // Send a new verification email, and update his password or name.
        const hashNewPassword = await hashPassword(password);
        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: existingUser.id },
            data: {
              name: name,
              password: hashNewPassword,
            },
          });
          const token = generateToken();
          await tx.emailVerificationToken.create({
            data: {
              userId: existingUser.id,
              token,
              expirationDate: DateTime.utc()
                .plus({
                  minutes: EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_MINUTES,
                })
                .toJSDate(),
            },
          });
          await sendEmailVerificationMail({
            emailTo: existingUser.email,
            name: name as string,
            userId: existingUser.id,
            token,
          });
        });
        return NextResponse.json({
          errorCode: ErrorCodes.RESENT_VERIFICATION_EMAIL,
          message: "Successfully re-sent the verification email.",
          success: false,
        });
      }
    } else {
      // If the user does not exists in the system then create a new user and send the verification email.
      const hashedPassword = await hashPassword(password);

      // Creation of the user and token must be done in a prisma transaction.
      await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
          },
        });

        // Send verification email
        const token = generateToken();
        await tx.emailVerificationToken.create({
          data: {
            userId: newUser.id,
            token,
            expirationDate: DateTime.utc()
              .plus({
                minutes: EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_MINUTES,
              })
              .toJSDate(),
          },
        });
        await sendEmailVerificationMail({
          emailTo: email,
          name: name as string,
          userId: newUser.id,
          token,
        });
      });

      return NextResponse.json({
        success: true,
        message: "User registered successfully. Verification email sent.",
      });
    }
  } catch (err) {
    console.error("Error in registering user", err);
    return NextResponse.json({
      success: false,
      message: "An error occurred while registering the user",
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
