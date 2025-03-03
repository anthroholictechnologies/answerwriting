"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import { Check, X, Clock } from "lucide-react";
import Link from "next/link";
import { ButtonPrimary } from "answerwriting/components/react-common/buttons/button_primary";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import Image from "next/image";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const statusParam = searchParams.get("status") || "pending";
    setStatus(statusParam.toLowerCase());
  }, [searchParams]);

  // Select the appropriate GIF based on the payment status
  const statusGif =
    {
      success: "/payment_success.gif",
      failure: "/payment_failed.gif",
      pending: "/payment_pending.gif",
    }[status] || "/payment_pending.gif"; // Default to pending gif if status is unknown

  return (
    <>
      {/* Mobile Background - Only visible on smaller screens */}
      <div
        className="fixed inset-0 xl:hidden z-0"
        style={{
          backgroundImage: `url(${statusGif})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1px)",
        }}
      >
        <div className="absolute inset-0 bg-white opacity-80"></div>
      </div>

      {/* Main Content */}
      <div className="flex w-full h-screen overflow-hidden">
        {/* Left Section - Payment Status */}
        <div className="w-full xl:w-[50%] flex items-center justify-center p-4 z-10 relative">
          <div className="w-full max-w-md bg-white bg-opacity-90 rounded-lg p-6">
            <CardHeader className="text-center">
              {/* Icon with Dynamic Background */}
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                  status === "success"
                    ? "bg-green-100"
                    : status === "failure"
                      ? "bg-red-100"
                      : "bg-yellow-100"
                }`}
              >
                {status === "success" ? (
                  <Check className="h-8 w-8 text-green-600" />
                ) : status === "failure" ? (
                  <X className="h-8 w-8 text-red-600" />
                ) : (
                  <Clock className="h-8 w-8 text-yellow-600" />
                )}
              </div>

              {/* Title and Description */}
              <CardTitle className="text-2xl md:text-4xl font-bold">
                {status === "success"
                  ? "Payment Successful!"
                  : status === "failure"
                    ? "Payment Failed"
                    : "Payment Processing"}
              </CardTitle>

              <CardDescription className="text-base md:text-lg">
                {status === "success"
                  ? "Your payment has been processed successfully. You have unlimited AI evaluations now."
                  : status === "failure"
                    ? "We were unable to process your payment. Please try again after 30 minutes."
                    : "Your payment is being processed. This may take 24 hours."}
              </CardDescription>
            </CardHeader>

            {/* Action Buttons */}
            <CardFooter className="flex flex-col space-y-2">
              {(status === "success" || status === "pending") && (
                <Link href={ApiRoutePaths.PAGE_DASHBOARD}>
                  <ButtonPrimary>Back to Dashboard</ButtonPrimary>
                </Link>
              )}

              {status === "failure" && (
                <Link href={ApiRoutePaths.PAGE_UPGRADE}>
                  <ButtonPrimary>Try Again</ButtonPrimary>
                </Link>
              )}

              {(status === "failure" || status === "pending") && (
                <p className="text-xs text-center mt-4 text-gray-500">
                  Need help?{" "}
                  <Link
                    href={ApiRoutePaths.PAGE_CONTACT_US}
                    className="text-primary-dark hover:underline"
                  >
                    Contact our support team
                  </Link>
                </p>
              )}
            </CardFooter>
          </div>
        </div>

        {/* Right Section - GIF Display (only for xl screens) */}
        <div className="xl:w-[50%] h-screen hidden xl:block border-l border-gray-200">
          <Image
            src={statusGif}
            alt="Payment Status Image"
            width={1080}
            height={1080}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </>
  );
}

export default function PaymentStatus() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}
