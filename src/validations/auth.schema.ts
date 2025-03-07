import { z } from "zod";

export const registrationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter your name." })
    .max(50, { message: "Please enter a name shorter than 50 charecters" })
    .trim(),
  email: z
    .string({ message: "Please enter a valid email address" })
    .email({ message: "Please enter a valid email address." })
    .trim(),
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

export const loginSchema = z.object({
  email: z
    .string({ message: "Please enter a valid email address" })
    .email({ message: "Please enter a valid email address." })
    .trim(),
  password: z.string({ message: "Please enter your password." }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const verifyEmailSchema = z.object({
  a: z.string(),
  b: z.string(),
});
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim(),
});

export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z.object({
  a: z.string(),
  b: z.string(),
  c: z
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
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
