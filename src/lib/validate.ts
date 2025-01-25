import { ApiRoutePaths, apiRoutesSchemaMapping } from "./config";

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
