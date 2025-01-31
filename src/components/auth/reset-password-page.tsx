"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "answerwriting/components/ui/input";
import { Button } from "answerwriting/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "answerwriting/validations/auth.schema";
import { useCustomToast } from "../react-common/toast";
import { resetPassword } from "answerwriting/lib/utils/api/auth.api";
import { ToastAction } from "../ui/toast";
import { ApiRoutePaths, ErrorCodes } from "answerwriting/types/general.types";
import Spinner from "../react-common/spinner";
import { useAsyncFn } from "react-use";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import AuthContainer from "./auth-container";
import AuthHeader from "./auth-header";

export default function ResetPasswordForm({
  token,
  userId,
}: {
  token: string;
  userId: string;
}) {
  const router = useRouter();
  const toast = useCustomToast();

  const [{ loading }, resetPasswordFn] = useAsyncFn(
    async (data: ResetPasswordInput) => {
      try {
        const result = await resetPassword({
          ...data,
          a: userId,
          b: token,
        });
        if (result.success) {
          toast.success({
            title: "Password Reset Successful",
            description: "Your password has been reset. You can now log in.",
          });

          router.push(ApiRoutePaths.PAGE_LOGIN);
        } else if (
          result.errorCode === ErrorCodes.RESET_PASSWORD_LINK_EXPIRED
        ) {
          toast.error({
            title: "Reset Link Expired",
            description:
              "Your reset password link has expired. Please request a new one.",
          });
        } else if (
          result.errorCode === ErrorCodes.TAMPERED_RESET_PASSWORD_URL
        ) {
          toast.error({
            title: "Invalid Reset Password Link",
            description:
              "The reset password link is invalid or broken. Please try again or contact support if the issue persists.",
          });
        }
      } catch (err: unknown) {
        console.log(err);
        toast.error({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem in the registration process.",
          action: (
            <ToastAction
              altText="Try again"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 hover:border-white/30 transition-all backdrop-blur-sm font-medium text-sm"
              onClick={() => window.location.reload()}
            >
              Try again
            </ToastAction>
          ),
        });
      }
    }
  );

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { a: userId, b: token, c: "" },
    shouldFocusError: true,
  });

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-md">
          <Spinner />
        </div>
      )}

      <Form {...form}>
        <AuthContainer classNames="lg:py-8">
          <AuthHeader />

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="c"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Please enter your new password"
                      className="placeholder:text-xs md:placeholder:text-sm text-xs md:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <div className="flex gap-4 justify-center">
              <Button
                className="w-[8rem]"
                disabled={loading || !form.formState.isValid}
                onClick={() => {
                  resetPasswordFn(form.getValues());
                }}
              >
                Submit
              </Button>

              <Button
                variant="outline"
                className="w-[8rem]"
                disabled={loading}
                onClick={() => {
                  router.push(ApiRoutePaths.PAGE_LOGIN);
                }}
              >
                Back
              </Button>
            </div>
          </div>
        </AuthContainer>
      </Form>
    </div>
  );
}
