"use client";
import { useAsyncFn } from "react-use";
import { forgetPassword } from "answerwriting/lib/utils/api/auth.api";
import { useCustomToast } from "../react-common/toast";
import { Button } from "../ui/button";
import Spinner from "../react-common/spinner";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ForgetPasswordInput,
  forgetPasswordSchema,
} from "answerwriting/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/navigation";
import AuthContainer from "./auth-container";
import AuthHeader from "./auth-header";

const ForgotPassword = () => {
  const form = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
    shouldFocusError: true,
  });
  const toast = useCustomToast();
  const router = useRouter();

  const [{ loading }, makeRequest] = useAsyncFn(
    async (data: ForgetPasswordInput) => {
      try {
        // Send API request
        const resp = await forgetPassword(data);

        if (resp.success) {
          toast.success({
            title: "Password Reset Link Sent!",
            description: "Check your email for further instructions.",
          });
        } else {
          handleError(resp);
        }
      } catch (err: unknown) {
        console.error("Error sending forget password request", err);
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
    },
    []
  );

  const handleError = (resp: ApiResponse) => {
    switch (resp.errorCode) {
      case ErrorCodes.USER_NOT_FOUND:
        toast.error({
          title: "Email Not Recognized",
          description:
            "We couldn't find an account with this email. Please check for typos or use a different email.",
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

        break;
      case ErrorCodes.VERIFICATION_EMAIL_PENDING:
        toast.error({
          title: "Email Verification Required",
          description:
            "You need to verify your email before resetting your password. Check your inbox or spam folder for a verification link.",
        });

        break;
      case ErrorCodes.RESET_PASSWORD_LINK_ALREADY_SENT:
        toast.error({
          title: "Reset Link Already Sent",
          description:
            "We've already sent a password reset email. Please check your inbox and spam folder. If you haven't received it, try again later.",
        });

        break;
      case ErrorCodes.TOO_MANY_RESET_PASSWORD_ATTEMPTS:
        toast.error({
          title: "Too Many Attempts",
          description:
            "You've requested multiple password resets in a short time. Please wait before trying again.",
        });
        break;
      default:
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
  };

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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Please enter your email address"
                      className="placeholder:text-xs md:placeholder:text-sm text-xs md:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <div className="flex justify-center gap-4">
              <Button
                className="w-[8rem]"
                disabled={loading || !form.formState.isValid}
                onClick={() => {
                  makeRequest(form.getValues());
                }}
              >
                Submit
              </Button>

              <Button
                variant="outline"
                className="w-[8rem]"
                disabled={loading}
                onClick={() => {
                  router.push("/auth/login");
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
};

export default ForgotPassword;
