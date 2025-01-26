import { NextRequest, NextResponse } from "next/server";
import {
  apiRoutesWhichRequiresAuthentication,
  apiRoutesWhichRequiresValidations,
} from "./config";
import { validateRequest } from "./lib/utils/validation.utils";
import { formatZodErrors } from "./lib/utils/validation.utils";
import { ApiRoutePaths, ErrorCodes } from "./types/general.types";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname as ApiRoutePaths;
  // Middleware 1: Authentication Middleware
  if (apiRoutesWhichRequiresAuthentication.includes(pathName)) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    console.log("=====token====", token);
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    } else if (!token.emailVerified) {
      return NextResponse.redirect(new URL("/auth/register", request.url));
    }
  }

  // Middleware 2: Validation Middleware

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
