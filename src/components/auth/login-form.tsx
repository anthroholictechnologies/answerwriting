"use client";
import { cn } from "answerwriting/lib/utils";
import { Button } from "answerwriting/components/ui/button";
import { Input } from "answerwriting/components/ui/input";
import AnswerWritingLink from "../react-common/link";
import ImpactSpan from "../react-common/impact-span";
import LoginWithGoogleButton from "../react-common/login-with-google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "answerwriting/validations/auth.schema";
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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", name: "" },
    shouldFocusError: true,
  });

  const onSubmit = (values: z.infer<typeof registrationSchema>) => {
    console.log(values);
  };

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "flex flex-col gap-4 lg:shadow-xl lg:p-16 bg-white",
          className
        )}
        {...props}
      >
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
            "Enter a password"
          )}

          <Button
            type="submit"
            className="w-full max-w-[16rem] mx-auto mt-4"
            disabled={
              (form.formState.isDirty && !form.formState.isValid) ||
              form.formState.isSubmitting
            }
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
      </form>
    </Form>
  );
}
