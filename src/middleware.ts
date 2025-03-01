import { NextRequest, NextResponse } from "next/server";
import {
  apiRoutesWhichRequiresAuthentication,
  apiRoutesWhichRequiresValidations,
} from "./config";
import { validateRequest } from "./lib/utils/validation.utils";
import { formatZodErrors } from "./lib/utils/validation.utils";
import { ApiRoutePaths, ErrorCodes } from "./types/general.types";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname as ApiRoutePaths;
  const isApiCall = pathName.includes("/api");
  const isCron = pathName.includes("/api/cron");
  const session = await auth();

  if (isCron) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error(
        `Cron job ${pathName} failed to execute. Auth header missing`,
      );
      return NextResponse.json(
        {
          success: false,
          errorCode: ErrorCodes.UNAUTHORIZED,
          message: "Invalid or expired token",
        },
        { status: 401 },
      );
    }
  }

  if (apiRoutesWhichRequiresAuthentication.includes(pathName)) {
    if (!session?.user) {
      if (isApiCall) {
        return NextResponse.json(
          {
            success: false,
            errorCode: ErrorCodes.UNAUTHORIZED,
            message: "User not authenticated",
          },
          { status: 401 },
        );
      }
      return NextResponse.redirect(
        new URL(ApiRoutePaths.PAGE_LOGIN, request.url),
      );
    }

    if (session.user.password && !session.user.emailVerified) {
      return NextResponse.redirect(
        new URL(ApiRoutePaths.PAGE_LOGIN, request.url),
      );
    }
  }
  // API validation logic
  if (apiRoutesWhichRequiresValidations.includes(pathName)) {
    const body = await request.json();
    const validations = validateRequest({
      path: pathName,
      requestBody: body,
    });

    if (validations.error) {
      const formattedError = formatZodErrors(validations.error);
      console.error(
        `validation error in middleware for path: ${pathName}`,
        formattedError,
      );
      /*
       * Follow response format
       * {
       *   success: boolean, (required always)
       *   errorCode?: ErrorCode (required if success is false),
       *   message: string, (required always)
       *   data? ApiResponseData (optinal)
       * }
       */
      return NextResponse.json(
        {
          success: false,
          errorCode: ErrorCodes.BAD_REQUEST_EXCEPTION,
          message: formattedError,
        },
        { status: 400 },
      );
    }
  }

  return NextResponse.next();
}
