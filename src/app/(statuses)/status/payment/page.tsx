"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
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

type PaymentStatusType = "success" | "failure" | "pending";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatusType>("pending");

  useEffect(() => {
    const statusParam = searchParams.get("status") as PaymentStatusType | null;
    if (
      statusParam &&
      ["success", "failure", "pending"].includes(statusParam)
    ) {
      setStatus(statusParam);
    }
  }, [searchParams]);

  const statusGif: Record<PaymentStatusType, string> = {
    success: "/payment_success.gif",
    failure: "/payment_failed.gif",
    pending: "/payment_pending.gif",
  };

  const statusConfig: Record<
    PaymentStatusType,
    {
      bgColor: string;
      iconColor: string;
      icon: React.ReactNode;
      title: string;
      description: string;
    }
  > = {
    success: {
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      icon: <Check className="h-8 w-8 text-green-600" />,
      title: "Payment Successful!",
      description:
        "Your payment has been processed successfully. You have unlimited AI evaluations now.",
    },
    failure: {
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      icon: <X className="h-8 w-8 text-red-600" />,
      title: "Payment Failed",
      description:
        "We were unable to process your payment. Please try again after 30 minutes.",
    },
    pending: {
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      icon: <Clock className="h-8 w-8 text-yellow-600" />,
      title: "Payment Processing",
      description: "Your payment is being processed. This may take 24 hours.",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 lg:flex-row-reverse lg:items-center lg:gap-10 overflow-hidden">
      {/* Image Section */}
      <div className="w-full max-w-md flex justify-center lg:max-w-xl">
        <Image
          src={statusGif[status]}
          alt="Payment Status Illustration"
          width={1080}
          height={1080}
          className="w-full h-auto max-h-[50vh] object-cover rounded-lg"
          priority
        />
      </div>

      {/* Card Section */}
      <div className="w-full flex justify-center lg:max-w-xl lg:border-r lg:border-gray-200">
        <div className="w-full text-center flex flex-col items-center md:p-8 max-h-[80vh] overflow-hidden">
          <CardHeader className="pb-2">
            <div
              className={`mx-auto hidden xl:flex mb-6 h-16 w-16 items-center justify-center rounded-full ${currentStatus.bgColor}`}
            >
              {currentStatus.icon}
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
              {currentStatus.title}
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-gray-600">
              {currentStatus.description}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col pt-4 pb-2 w-full">
            {(status === "success" || status === "pending") && (
              <Link
                href={ApiRoutePaths.PAGE_DASHBOARD}
                className="w-full flex justify-center"
              >
                <ButtonPrimary styles="py-3 text-base font-medium text-center">
                  Back to Dashboard
                </ButtonPrimary>
              </Link>
            )}

            {status === "failure" && (
              <Link
                href={ApiRoutePaths.PAGE_UPGRADE}
                className="w-full flex justify-center"
              >
                <ButtonPrimary styles="w-full py-3 text-base font-medium text-center">
                  Try Again
                </ButtonPrimary>
              </Link>
            )}

            {(status === "failure" || status === "pending") && (
              <p className="text-sm text-center mt-4 text-gray-500">
                Need help?{" "}
                <Link
                  href={ApiRoutePaths.PAGE_CONTACT_US}
                  className="text-primary-dark hover:underline font-medium"
                >
                  Contact our support team
                </Link>
              </p>
            )}
          </CardFooter>
        </div>
      </div>
    </div>
  );
}

export default function PaymentStatus() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
