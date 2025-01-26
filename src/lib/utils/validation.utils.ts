import { apiRoutesSchemaMapping } from "answerwriting/config";
import { ApiRoutePaths } from "answerwriting/types/general.types";

import { ZodError } from "zod";

export function formatZodErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."), // Path to the field that caused the error
    message: issue.message, // Error message
    code: issue.code, // Zod-specific error code (e.g., "invalid_type")
  }));
}

export function validateRequest({
  path,
  requestBody,
}: {
  requestBody: unknown;
  path: ApiRoutePaths;
}) {
  try {
    const zodSchema = apiRoutesSchemaMapping[path];

    if (!zodSchema) {
      throw new Error(`No zod schema found for ${path}`);
    }
    const data = zodSchema.safeParse(requestBody);

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    throw new Error("Error validation the request body: " + err?.message);
  }
}
