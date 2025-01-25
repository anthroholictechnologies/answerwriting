import { z } from "zod";

export const registrationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .trim(),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message:
        "Password must contain at least one special character (@, $, !, %, *, ?, &)",
    }),
});
export type RegistrationInput = z.infer<typeof registrationSchema>;

export const verifyEmailSchema = z.object({
  a: z.string().uuid(),
  b: z.string().uuid(),
});
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
});

export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
