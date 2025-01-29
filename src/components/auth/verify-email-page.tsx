"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAsyncFn } from "react-use";
import { verifyEmail } from "answerwriting/lib/utils/api/auth.api";
import { ToastAction } from "../ui/toast";
import { useCustomToast } from "../react-common/toast";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";
import Spinner from "../react-common/spinner";
import { Button } from "../ui/button";
import ImpactSpan from "../react-common/impact-span";

// Type Definitions
interface VerifyEmailProps {
  userId: string;
  token: string;
}

interface VerificationState {
  message: string;
  explanation: string;
  redirectUrl: string;
  redirectText: string;
}

const VerifyEmail = ({ userId, token }: VerifyEmailProps) => {
  const router = useRouter();
  const toast = useCustomToast();
  const [state, setState] = useState<VerificationState | null>(null);

  const [{ loading }, makeRequest] = useAsyncFn(async () => {
    try {
      const resp = await verifyEmail({ a: userId, b: token });
      handleResponse(resp);
    } catch (err) {
      console.error(err);
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
  }, []);

  // Handle API response
  const handleResponse = (resp: ApiResponse) => {
    if (resp.success) {
      setState({
        message: "Email verification successful",
        explanation:
          "Email verified! 🚀 You're now ready to dive in. Log in and take your answer-writing journey to the next level!",
        redirectUrl: "/auth/login",
        redirectText: "Login",
      });
      return;
    }

    switch (resp.errorCode) {
      case ErrorCodes.VERIFICATION_EMAIL_EXPIRED:
        setState({
          message: "Verification email expired",
          explanation:
            "Oops! Your email verification link has expired. 😕 Please request a new verification email to complete your registration.",
          redirectUrl: "/auth/register",
          redirectText: "Register Again",
        });
        break;

      case ErrorCodes.EMAIL_ALREADY_VERIFIED:
        setState({
          message: "Email already verified",
          explanation:
            "You have already verified your email. Please login to continue.",
          redirectUrl: "/auth/login",
          redirectText: "Login",
        });
        break;

      default:
        setState({
          message: "Invalid verification link",
          explanation:
            "Invalid or broken verification link! 😕 It looks like the link is incorrect or has been tampered with. Please request a new verification email to continue.",
          redirectUrl: "/auth/register",
          redirectText: "Register Again",
        });
    }
  };

  useEffect(() => {
    makeRequest();
  }, [makeRequest]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-md">
          <Spinner />
        </div>
      )}

      {state && (
        <div className="flex flex-col lg:shadow-xl lg:p-8 bg-white">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Logo */}
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

            {/* Message & Button */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold">{state.message}</h1>
                <p className="text-sm text-secondary text-center">
                  {state.explanation}
                </p>
              </div>

              <Button
                className="max-w-xs mx-auto p-4 mt-4"
                onClick={() => router.push(state.redirectUrl)}
              >
                {state.redirectText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
