import {
  ApiResponse,
  EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_HOURS,
  ErrorCodes,
} from "answerwriting/lib/config";
import { prisma } from "answerwriting/lib/prisma";
import { RegistrationInput } from "answerwriting/validations/authSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  createVerificationToken,
  getLatestVerificationToken,
  hasTooManyVerificationEmails,
  isTokenExpired,
  sendEmailVerificationMail,
} from "answerwriting/lib/helpers/emailVerification.helpers";
import { v4 } from "uuid";
import { DateTime } from "luxon";

/**
 * High-Level Logic:
 * 1. Parse and validate the registration request body.
 * 2. Check if a user with the provided email already exists:
 *    a. If the user exists and is verified, return a conflict response.
 *    b. If the user exists but is not verified:
 *       i. Check if a verification token already exists:
 *          - If expired, send a new verification email unless rate-limited.
 *          - If pending, inform the user to check their email.
 *       ii. If no token exists, generate a new token and send the email.
 *    c. If the user does not exist, create a new user, generate a token, and send a verification email.
 * 3. Handle errors and return appropriate responses.
 */

// Main registration handler
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    // Step 1: Parse and validate the request body
    const body = (await request.json()) as RegistrationInput;
    const { email, password, firstName, lastName } = body;

    // Step 2: Check if a user with the provided email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // Case 2a: User already exists and is verified
      if (existingUser.emailVerified) {
        return NextResponse.json(
          {
            success: false,
            message: `User already exists with email ${email}`,
            errorCode: ErrorCodes.EMAIL_CONFLICT_EXCEPTION,
          },
          { status: 409 },
        );
      }

      // Case 2b: User exists but is not verified
      const latestVerificationToken = await getLatestVerificationToken(
        existingUser.id,
      );
      if (latestVerificationToken) {
        if (isTokenExpired(latestVerificationToken.expirationDate)) {
          // Case 2b-i: Expired verification token
          if (await hasTooManyVerificationEmails(existingUser.id)) {
            return NextResponse.json(
              {
                message:
                  "Too many attempts to register. Please try again after 24 hours.",
                success: false,
                errorCode: ErrorCodes.TOO_MANY_VERIFICATION_EMAILS_SENT,
              },
              { status: 429 },
            );
          } else {
            const token = await createVerificationToken(existingUser.id);
            await sendEmailVerificationMail({
              emailTo: existingUser.email,
              firstName: existingUser.firstName as string,
              userId: existingUser.id,
              token,
            });
            return NextResponse.json({
              message: "Successfully re-sent the verification email.",
              success: true,
            });
          }
        } else {
          // Case 2b-ii: Pending verification email
          return NextResponse.json(
            {
              success: false,
              message:
                "Verification email is pending. Please check your email for the verification link.",
              errorCode: ErrorCodes.VERIFICATION_EMAIL_PENDING,
            },
            { status: 409 },
          );
        }
      } else {
        // Case 2b-iii: No verification token exists
        const token = await createVerificationToken(existingUser.id);
        await sendEmailVerificationMail({
          emailTo: existingUser.email,
          firstName: existingUser.firstName as string,
          userId: existingUser.id,
          token,
        });
        return NextResponse.json({
          message:
            "Please verify your email. We've sent you a verification email.",
          success: true,
        });
      }
    } else {
      // Step 3: Create a new user if the email does not exist
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creation of the user and token must be done in a prisma transaction.
      await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
          },
        });

        // Send verification email
        const token = v4();
        await tx.emailVerificationToken.create({
          data: {
            userId: newUser.id,
            token,
            expirationDate: DateTime.utc()
              .plus({
                hours: EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_HOURS,
              })
              .toJSDate(),
          },
        });
        await sendEmailVerificationMail({
          emailTo: email,
          firstName: firstName as string,
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
    // Step 4: Handle errors
    console.error("Error in registering user", err);
    return NextResponse.json({
      success: false,
      message: "An error occurred while registering the user",
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
