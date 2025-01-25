import { ZodError } from "zod";

export function formatZodErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."), // Path to the field that caused the error
    message: issue.message, // Error message
    code: issue.code, // Zod-specific error code (e.g., "invalid_type")
  }));
}
