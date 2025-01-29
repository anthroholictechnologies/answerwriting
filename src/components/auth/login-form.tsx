"use client";

import { Button } from "answerwriting/components/ui/button";
import { Input } from "answerwriting/components/ui/input";
import AnswerWritingLink from "../react-common/link";
import ImpactSpan from "../react-common/impact-span";
import LoginWithGoogleButton from "../react-common/login-with-google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "answerwriting/validations/auth.schema";
import Link from "next/link";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { signInWithCredentials } from "answerwriting/actions";
import { ErrorCodes } from "answerwriting/types/general.types";
import { ToastAction } from "../ui/toast";
import { useCustomToast } from "../react-common/toast";
import Spinner from "../react-common/spinner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
    shouldFocusError: true,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const toast = useCustomToast();

  const router = useRouter();

  const loginWithCreds = async ({ email, password }: LoginInput) => {
    setLoading(true);
    const result = await signInWithCredentials({
      email,
      password,
    });
    setLoading(false);

    if (result.success) {
      toast.info({
        title: "Successfull login!",
        description: "Redirecting you to the dashboard...",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      if (result?.errorCode === ErrorCodes.INVALID_CREDENTIALS) {
        toast.error({
          title: "Invalid Credentials.",
          description: "Please enter correct email or password.",
          action: (
            <ToastAction
              altText="Try again"
              className="
                  px-4 py-2
                  bg-white/10 
                  hover:bg-white/20 
                  text-white 
                  rounded-lg
                  border border-white/20 
                  hover:border-white/30
                  transition-all
                  backdrop-blur-sm
                  font-medium
                  text-sm"
              onClick={() => window.location.reload()}
            >
              Try Again
            </ToastAction>
          ),
        });
      } else if (result.errorCode === ErrorCodes.USER_NOT_FOUND) {
        toast.warning({
          title: "No account with this email found!",
          description: "Click on the button below to create an account.",
          action: (
            <ToastAction
              altText="Try again"
              className="
                  px-4 py-2
                  bg-white/10 
                  hover:bg-white/20 
                  text-white 
                  rounded-lg
                  border border-white/20 
                  hover:border-white/30
                  transition-all
                  backdrop-blur-sm
                  font-medium
                  text-sm"
              onClick={() => router.push("/auth/register")}
            >
              Register
            </ToastAction>
          ),
        });
      } else if (result.errorCode === ErrorCodes.VERIFICATION_EMAIL_PENDING) {
        toast.error({
          title: "Please verify your email id first",
          description:
            "Please verify your email id first to continue with login. Check your email or register to get a new verification email.",
          action: (
            <ToastAction
              altText="Try again"
              className="
                  px-4 py-2
                  bg-white/10 
                  hover:bg-white/20 
                  text-white 
                  rounded-lg
                  border border-white/20 
                  hover:border-white/30
                  transition-all
                  backdrop-blur-sm
                  font-medium
                  text-sm"
              onClick={() => router.push("/auth/register")}
            >
              Register
            </ToastAction>
          ),
        });
      } else if (
        result.errorCode === ErrorCodes.ALREADY_REGISTERED_WITH_GOOGLE
      ) {
        toast.error({
          title: "You have already registered with Google",
          description:
            "Please continue with google or try a different email account.",
        });
      }
    }
  };

  const renderFormField = (
    name: string,
    label: string,
    type = "text",
    placeholder: string,
  ) => (
    <FormField
      control={form.control}
      name={name as keyof z.infer<typeof loginSchema>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              className="placeholder:text-xs md:placeholder:text-sm text-xs md:text-sm"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-md">
          <Spinner />
        </div>
      )}
      <Form {...form}>
        <div className="flex flex-col gap-4 lg:shadow-xl lg:p-16 bg-white">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Logo and tagline */}
            <div className="flex flex-col items-center">
              <Link href="/">
                <Image
                  src="/logos/3_resize.png"
                  alt="answerwriting.com logo"
                  height={50}
                  width={250}
                  className="w-[90%] h-[100%] lg:h-[120%]"
                />
              </Link>
              <p className="text-balance ml-[13%] -mt-2 text-[0.7rem] italic">
                Craft <ImpactSpan text="Better Answers" /> with AI Precision
              </p>
            </div>
            {/* Heading */}
            <h1 className="text-2xl font-bold">
              <ImpactSpan text="Login" /> to your account
            </h1>
          </div>

          {/* Form fields */}
          <div className="grid gap-4">
            {renderFormField("email", "Email", "email", "jane@example.com")}
            {renderFormField(
              "password",
              "Password",
              "password",
              "Enter a password",
            )}

            <Button
              type="submit"
              className="w-full max-w-[16rem] mx-auto mt-4"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              onClick={async () => {
                await loginWithCreds({
                  email: form.getValues().email,
                  password: form.getValues().password,
                });
              }}
            >
              Sign in
            </Button>

            {/* Divider */}
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border p-2">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>

            {/* Social login button */}
            <LoginWithGoogleButton />
          </div>

          {/* Footer */}
          <p className="text-center text-xs md:text-sm mt-3">
            Already have an account?{" "}
            <AnswerWritingLink
              href="/auth/register"
              linkText="Sign up"
              overrideClasses="underline underline-offset-4 text-xs md:text-sm"
            />
          </p>
        </div>
      </Form>
    </div>
  );
}
