"use client";
import { Input } from "answerwriting/components/ui/input";
import ImpactSpan from "../react-common/impact-span";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegistrationInput,
  registrationSchema,
} from "answerwriting/validations/auth.schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { registerUser } from "answerwriting/lib/utils/api/auth.api";
import { useAsyncFn } from "react-use";
import { ToastAction } from "../ui/toast";
import { useCustomToast } from "../react-common/toast";
import { ApiRoutePaths, ErrorCodes } from "answerwriting/types/general.types";
import Spinner from "../react-common/spinner";
import { useRouter } from "next/navigation";
import AuthContainer from "./auth-container";
import AuthHeader from "./auth-header";
import AuthFooter from "./auth-footer";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", name: "" },
    shouldFocusError: true,
  });
  const toast = useCustomToast();
  const [{ loading }, onSubmit] = useAsyncFn(
    async (data: RegistrationInput) => {
      try {
        const resp = await registerUser(data);
        if (resp.success) {
          toast.info({
            title: "Registration Successful 🎉",
            description:
              "A verification email has been sent to your inbox. Please check your email and follow the instructions to activate your account.",
          });
        } else {
          if (resp.errorCode === ErrorCodes.EMAIL_CONFLICT_EXCEPTION) {
            toast.error({
              title: "Email Already Registered",
              description:
                "An account with this email already exists. Please sign in to continue.",

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
                      text-sm
                    "
                  onClick={() => router.push(ApiRoutePaths.PAGE_LOGIN)}
                >
                  Sign in
                </ToastAction>
              ),
            });
          } else if (resp.errorCode === ErrorCodes.RESENT_VERIFICATION_EMAIL) {
            toast.info({
              title: "Verification Email Sent Again",
              description:
                "We've sent you a new verification email. Please check your inbox.",
            });
          }
        }
      } catch (err) {
        console.log(err);
        toast.error({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem in the registration process.",
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
                text-sm
              "
              onClick={() => window.location.reload()}
            >
              Try again
            </ToastAction>
          ),
        });
      }
    }
  );

  const renderFormField = (
    name: string,
    label: string,
    type = "text",
    placeholder: string
  ) => (
    <FormField
      control={form.control}
      name={name as keyof z.infer<typeof registrationSchema>}
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
        <AuthContainer classNames="lg:p-8 lg:px-16">
          <AuthHeader
            heading={
              <h1 className="text-2xl font-bold">
                <ImpactSpan text="Create" /> an account
              </h1>
            }
          />
          {/* Form fields */}
          <div className="grid gap-3">
            {renderFormField("name", "Full Name", "text", "Jane Doe")}
            {renderFormField("email", "Email", "email", "jane@example.com")}
            {renderFormField(
              "password",
              "Password",
              "password",
              "Enter a password"
            )}

            <AuthFooter
              btnText="Sign up"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              onClick={() => {
                onSubmit(form.getValues());
              }}
              href={ApiRoutePaths.PAGE_LOGIN}
              linkText="Login"
            />
          </div>
        </AuthContainer>
      </Form>
    </div>
  );
}
