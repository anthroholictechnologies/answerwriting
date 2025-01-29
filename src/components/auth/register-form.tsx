"use client";

import { cn } from "answerwriting/lib/utils";
import { Button } from "answerwriting/components/ui/button";
import { Input } from "answerwriting/components/ui/input";
import AnswerWritingLink from "../react-common/link";
import ImpactSpan from "../react-common/impact-span";
import LoginWithGoogleButton from "../react-common/login-with-google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegistrationInput,
  registrationSchema,
} from "answerwriting/validations/auth.schema";
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
import { registerUser } from "answerwriting/lib/utils/api/auth.api";
import { useAsyncFn } from "react-use";
import { ToastAction } from "../ui/toast";
import { useCustomToast } from "../react-common/toast";
import { ErrorCodes } from "answerwriting/types/general.types";
import Spinner from "../react-common/spinner";
import { useRouter } from "next/navigation";

export function RegisterForm({
  className,
}: React.ComponentPropsWithoutRef<"form">) {
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
            title: "Registration Successful",
            description:
              "We've sent you a verification email. Please check your inbox.",
          });
        } else {
          if (resp.errorCode === ErrorCodes.EMAIL_CONFLICT_EXCEPTION) {
            toast.error({
              title: "Email already registered.",
              description:
                "You have already registered with us. Please Sign in to continue.",
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
                  onClick={() => router.push("/auth/login")}
                >
                  Sign in
                </ToastAction>
              ),
            });
          } else if (resp.errorCode === ErrorCodes.RESENT_VERIFICATION_EMAIL) {
            toast.info({
              title: "Re-sent the verification email",
              description: "We've re-sent you a verification email again.",
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
    },
  );

  const renderFormField = (
    name: string,
    label: string,
    type = "text",
    placeholder: string,
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
        <div
          className={cn(
            "flex flex-col gap-4 lg:shadow-xl lg:p-8 bg-white",
            className,
          )}
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-8 text-center">
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
            <h1 className="text-2xl font-bold">
              <ImpactSpan text="Create" /> an account
            </h1>
          </div>

          {/* Form fields */}
          <div className="grid gap-3">
            {renderFormField("name", "Full Name", "text", "Jane Doe")}
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
              disabled={
                (form.formState.isDirty && !form.formState.isValid) ||
                form.formState.isSubmitting
              }
              onClick={() => {
                onSubmit(form.getValues());
              }}
            >
              Sign up
            </Button>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border p-2">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>

            <LoginWithGoogleButton />
          </div>

          {/* Footer */}
          <p className="text-center text-xs md:text-sm">
            Already have an account?{" "}
            <AnswerWritingLink
              href="/auth/login"
              linkText="Sign in"
              overrideClasses="underline underline-offset-4 text-xs md:text-sm"
            />
          </p>
        </div>
      </Form>
    </div>
  );
}

// $2a$10$e97VJ9qeVQiwjfSoZVpNkunWf/O9HqDpj7GhowNHl4kIedaUiZFdK
