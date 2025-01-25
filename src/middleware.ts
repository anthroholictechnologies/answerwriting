import { NextRequest, NextResponse } from "next/server";
import {
  ApiRoutePaths,
  apiRoutesWhichRequiresValidations,
  ErrorCodes,
} from "./lib/config";
import { validateRequest } from "./lib/validate";
import { formatZodErrors } from "./lib/formatZodErrors";

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname as ApiRoutePaths;
  const isAPIPath = request.nextUrl.pathname.includes("/api");

  // Logic for only the api paths
  if (isAPIPath) {
    // API paths must be registered in our backend
    if (!Object.values(ApiRoutePaths).includes(pathName)) {
      // Return a 404 Not Found response for routes not defined in the routes.types file
      return new Response("The route path is not registered on the server", {
        status: 404,
      });
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
  }

  return NextResponse.next();
}
