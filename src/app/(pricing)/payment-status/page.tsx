"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import { Check, X, Clock } from "lucide-react";
import Link from "next/link";
import { ButtonPrimary } from "answerwriting/components/react-common/buttons/button_primary";
import { ApiRoutePaths } from "answerwriting/types/general.types";

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("pending");

  // Set payment status based on URL query parameter
  useEffect(() => {
    const statusParam = searchParams.get("status") || "pending";
    setStatus(statusParam.toLowerCase());

    // You could fetch real order details here
    // const orderId = searchParams.get('orderId');
    // fetchOrderDetails(orderId).then(data => setDetails(data));
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Dynamic Status Icon */}
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

          {/* Dynamic Title */}
          <CardTitle className="text-2xl font-bold">
            {status === "success"
              ? "Payment Successful!"
              : status === "failure"
                ? "Payment Failed"
                : "Payment Processing"}
          </CardTitle>

          {/* Dynamic Description */}
          <CardDescription className="text-base">
            {status === "success"
              ? `Your payment has been processed successfully. We've sent a receipt to your email address`
              : status === "failure"
                ? "We were unable to process your payment. Please check the details below and try again."
                : "Your payment is being processed. This may take a moment."}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col space-y-2">
          {/* Dynamic Buttons Based on Status */}
          {status === "success" && (
            <Link href={ApiRoutePaths.PAGE_DASHBOARD}>
              {" "}
              <ButtonPrimary>Back to Dashboard</ButtonPrimary>{" "}
            </Link>
          )}

          {status === "pending" && (
            <Link href={ApiRoutePaths.PAGE_DASHBOARD}>
              {" "}
              <ButtonPrimary>Back to Dashboard</ButtonPrimary>{" "}
            </Link>
          )}

          {status === "failure" && (
            <Link href={ApiRoutePaths.PAGE_UPGRADE}>
              <ButtonPrimary>Try Again</ButtonPrimary>
            </Link>
          )}

          {/* Support Link for Failure & Pending */}
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
      </Card>
    </div>
  );
}
