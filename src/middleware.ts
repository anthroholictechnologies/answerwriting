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
  const session = await auth();
  console.log("=====session", session);

  if (apiRoutesWhichRequiresAuthentication.includes(pathName)) {
    if (!session?.user) {
      return NextResponse.redirect(
        new URL(ApiRoutePaths.PAGE_LOGIN, request.url)
      );
    }

    if (session.user.password && !session.user.emailVerified) {
      return NextResponse.redirect(
        new URL(ApiRoutePaths.PAGE_LOGIN, request.url)
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
        formattedError
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
        { status: 400 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
