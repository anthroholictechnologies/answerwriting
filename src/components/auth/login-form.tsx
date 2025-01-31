"use client";
import { Button } from "answerwriting/components/ui/button";
import { Input } from "answerwriting/components/ui/input";
import AnswerWritingLink from "../react-common/link";
import ImpactSpan from "../react-common/impact-span";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "answerwriting/validations/auth.schema";

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
import { ApiRoutePaths, ErrorCodes } from "answerwriting/types/general.types";
import { ToastAction } from "../ui/toast";
import { useCustomToast } from "../react-common/toast";
import Spinner from "../react-common/spinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardTitle } from "../ui/card";
import AuthContainer from "./auth-container";
import AuthHeader from "./auth-header";
import AuthFooter from "./auth-footer";

export function LoginForm({ urlError }: { urlError: string }) {
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
        title: "Login Successful!",
        description: "You're being redirected to your dashboard...",
      });

      router.push(ApiRoutePaths.PAGE_DASHBOARD);
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
          title: "No account found with this email",
          description:
            "It looks like you haven’t signed up yet. Click the button below to create an account.",

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
              onClick={() => router.push(ApiRoutePaths.PAGE_REGISTER)}
            >
              Register
            </ToastAction>
          ),
        });
      } else if (result.errorCode === ErrorCodes.VERIFICATION_EMAIL_PENDING) {
        toast.error({
          title: "Email Verification Required",
          description:
            "Please verify your email before logging in. Check your inbox for the verification email, or register again to receive a new one.",

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
              onClick={() => router.push(ApiRoutePaths.PAGE_REGISTER)}
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
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={name as keyof z.infer<typeof loginSchema>}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between">
            <FormLabel>{label}</FormLabel>
            {name === "password" && (
              <AnswerWritingLink
                href="/auth/forget-password"
                linkText="Forgot your password?"
                overrideClasses="ml-auto text-xs md:text-sm p-0 m-0 h-1"
              />
            )}
          </div>
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
      {urlError === "OAuthAccountNotLinked" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-md p-4">
          <Card className="p-4">
            <CardTitle> Account already registered. </CardTitle>
            <CardDescription className="mt-4 flex gap-4 flex-col">
              {` It looks like you've already registered with this email and password.
          Please use your credentials to log in, or try signing in with a
          different Google account.`}

              <Button
                className="max-w-[8rem] mx-auto"
                onClick={() => router.push(ApiRoutePaths.PAGE_LOGIN)}
              >
                {" "}
                Try Again{" "}
              </Button>
            </CardDescription>
          </Card>
        </div>
      )}
      <Form {...form}>
        <AuthContainer>
          <AuthHeader
            heading={
              <h1 className="text-2xl font-bold">
                <ImpactSpan text="Login" /> to your account
              </h1>
            }
          />
          {/* Form fields */}
          <div className="grid gap-6">
            {renderFormField("email", "Email", "email", "jane@example.com")}
            {renderFormField(
              "password",
              "Password",
              "password",
              "Enter a password"
            )}
          </div>
          <AuthFooter
            btnText="Sign in"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            onClick={async () => {
              await loginWithCreds({
                email: form.getValues().email,
                password: form.getValues().password,
              });
            }}
            linkText="register"
            href={ApiRoutePaths.PAGE_REGISTER}
          />
        </AuthContainer>
      </Form>
    </div>
  );
}
