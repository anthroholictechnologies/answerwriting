"use client";
import React, { useMemo } from "react";
import { ButtonTertiary } from "../react-common/buttons/button_tertiary";
import {
  BillingOptions,
  Duration,
  Subscription,
  SubscriptionStatus,
} from "answerwriting/types/payment.types";
import { orderBy, maxBy } from "lodash";
import {
  convertPaisaToRupee,
  getDurationMonths,
} from "answerwriting/lib/utils";
import { useAsyncFn } from "react-use";
import { upgradeToPro } from "answerwriting/lib/utils/api/payments.api";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, LogIn } from "lucide-react";
import GuaranteeCard from "./gurantee";
import { ApiRoutePaths, ErrorCodes } from "answerwriting/types/general.types";
import { useCustomToast } from "../react-common/toast";
import { ToastAction } from "../ui/toast";
import Link from "next/link";
import { LoadingOverlay } from "./payment-loader";
import { EnhancedAlert } from "./payment-alert";

function formatDuration(duration: Duration): string {
  const durationMapping: Record<Duration, string> = {
    [Duration.ANNUAL]: "Annual",
    [Duration.HALF_YEARLY]: "Half-Yearly",
    [Duration.QUATERLY]: "Quarterly",
    [Duration.MONTHLY]: "Monthly",
  };
  return durationMapping[duration] || "Unknown";
}

const PriceDetails: React.FC<{ bo: BillingOptions; bestPlan: boolean }> = ({
  bo,
  bestPlan,
}) => (
  <div className="w-full lg:w-auto">
    {bestPlan && (
      <span className="inline-block text-primary-dark text-sm font-bold">
        Best Value
      </span>
    )}
    <div className="flex items-baseline flex-wrap">
      <span className="text-xl font-bold text-secondary-dark">
        ₹{convertPaisaToRupee(bo.totalPrice) / getDurationMonths(bo.duration)}
      </span>
      <span className="ml-1 text-sm text-secondary-dark">INR</span>
      <span className="ml-2 text-sm text-secondary-dark">per month</span>
    </div>
    {bo.totalPrice && getDurationMonths(bo.duration) > 1 && (
      <p className="text-gray-500 text-sm mt-1">
        ₹{convertPaisaToRupee(bo.totalPrice)} billed every{" "}
        {getDurationMonths(bo.duration)} months
      </p>
    )}
  </div>
);

const SelectButton: React.FC<{
  bo: BillingOptions;
  bestPlan: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
  isLoading: boolean;
  selectedPlan: string | null;
}> = ({ bo, bestPlan, onSelect, disabled, isLoading, selectedPlan }) => {
  const ButtonComponent = bestPlan ? ButtonTertiary : ButtonTertiary;
  const isSelected = selectedPlan === bo.id;

  return (
    <ButtonComponent
      onClick={() => onSelect(bo.id)}
      disabled={disabled || (isLoading && !isSelected)}
    >
      {isSelected && isLoading ? (
        <span className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </span>
      ) : (
        "Select"
      )}
    </ButtonComponent>
  );
};

const BillingOptionCard: React.FC<{
  bo: BillingOptions;
  bestPlan: boolean;
  onSelect: (id: string) => void;
  userLoggedIn: boolean;
  hasActiveSubscription: boolean;
  isLoading: boolean;
  selectedPlan: string | null;
}> = ({
  bo,
  bestPlan,
  onSelect,
  userLoggedIn,
  hasActiveSubscription,
  isLoading,
  selectedPlan,
}) => {
  const isSelected = selectedPlan === bo.id;

  return (
    <div
      className={`w-full mx-auto py-4 sm:py-0 border rounded-xl transition-all duration-300 
      ${
        isSelected && isLoading
          ? "border-primary-dark shadow-md"
          : bestPlan
            ? "hover:border-primary-dark bg-blue-50/30 border-blue-200"
            : "hover:border-primary-dark bg-white border-gray-200"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Left Section */}
        <div className="p-4 lg:w-1/3 md:border-r border-gray-200">
          <p className="font-semibold text-gray-800">
            {formatDuration(bo.duration)}
          </p>
          {bo.discountPercentage !== 0 && (
            <p className="text-primary-dark font-medium text-sm mt-1">
              Save {bo.discountPercentage}%
            </p>
          )}
        </div>

        {/* Right Section */}
        <div className="w-[90%] h-[150px] lg:h-[100px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <PriceDetails bo={bo} bestPlan={bestPlan} />
          <SelectButton
            bo={bo}
            bestPlan={bestPlan}
            onSelect={onSelect}
            disabled={!userLoggedIn || hasActiveSubscription}
            isLoading={isLoading}
            selectedPlan={selectedPlan}
          />
        </div>
      </div>
    </div>
  );
};

const PricingPlans: React.FC<{
  billingOptions: BillingOptions[];
  userLoggedIn: boolean;
  userSubscription: Subscription | null;
}> = ({ billingOptions, userLoggedIn, userSubscription }) => {
  const router = useRouter();
  const toast = useCustomToast();
  const hasActiveSubscription =
    userSubscription?.subscriptionStatus === SubscriptionStatus.ACTIVE;

  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);

  const [{ loading: isLoading }, initiatePayment] = useAsyncFn(
    async (id: string) => {
      try {
        setSelectedPlan(id);
        const response = await upgradeToPro({ productId: id });

        if (!response.success) {
          setSelectedPlan(null);
          const errorMessages: Record<
            string,
            { title: string; description: string }
          > = {
            [ErrorCodes.UNAUTHORIZED]: {
              title: "Login required",
              description: "Please login to purchase the subscription.",
            },
            [ErrorCodes.ALREADY_SUBSCRIBED]: {
              title: "You are already a PRO user",
              description: "Please head back to Dashboard.",
            },
          };

          toast.error({
            ...((response.errorCode && errorMessages[response.errorCode]) || {
              title: "Uh oh! Something went wrong.",
              description: "There was a problem processing your request.",
            }),
            action: (
              <ToastAction
                altText="altText"
                onClick={() => window.location.reload()}
              >
                {response.errorCode === ErrorCodes.UNAUTHORIZED
                  ? "Login"
                  : "Try again"}
              </ToastAction>
            ),
          });
        }

        if (response.data?.paymentGatewayUrl) {
          router.push(response.data?.paymentGatewayUrl);
        }
      } catch (error) {
        setSelectedPlan(null);
        console.error("Payment initiation failed:", error);
        toast.error({
          title: "Payment initialization failed",
          description:
            "Please try again or contact support if the issue persists.",
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => window.location.reload()}
            >
              Try again
            </ToastAction>
          ),
        });
      }
    }
  );

  const handleSelect = (id: string) => initiatePayment(id);

  const bestPlan = useMemo(
    () => maxBy(billingOptions, (bo) => bo.discountPercentage),
    [billingOptions]
  );

  const selectedPlanDetails = useMemo(() => {
    if (!selectedPlan) return null;
    return billingOptions.find((bo) => bo.id === selectedPlan);
  }, [selectedPlan, billingOptions]);

  const selectedPlanName = selectedPlanDetails
    ? formatDuration(selectedPlanDetails.duration)
    : "";

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 relative">
      {isLoading && selectedPlan && (
        <LoadingOverlay selectedPlanName={selectedPlanName} />
      )}

      <h2 className="text-3xl font-bold text-secondary-dark mb-8">
        Select your plan
      </h2>
      {!userLoggedIn && (
        <EnhancedAlert
          variant="destructive"
          title="Authentication Required"
          description="Please log in to your account to upgrade to PRO."
          icon={<LogIn className="h-5 w-5 text-red-500" />}
          action={
            <Link href="/login">
              <ButtonTertiary classes="whitespace-nowrap text-red-500 border-red-500">
                <span className="flex items-center">
                  Log In <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </ButtonTertiary>
            </Link>
          }
        />
      )}
      {hasActiveSubscription && (
        <EnhancedAlert
          variant="destructive"
          title="You already have a PRO subscription"
          description="You can manage your current subscription from your dashboard."
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          action={
            <Link href={ApiRoutePaths.PAGE_DASHBOARD}>
              <ButtonTertiary classes="whitespace-nowrap text-red-500 border-red-500">
                <span className="flex items-center">
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </ButtonTertiary>
            </Link>
          }
        />
      )}
      <div className="w-full space-y-4">
        {orderBy(billingOptions, "discountPercentage", "desc").map((bo) => (
          <BillingOptionCard
            key={bo.id}
            bo={bo}
            bestPlan={bestPlan?.id === bo.id}
            onSelect={handleSelect}
            userLoggedIn={userLoggedIn}
            hasActiveSubscription={hasActiveSubscription}
            isLoading={isLoading}
            selectedPlan={selectedPlan}
          />
        ))}
      </div>
      <GuaranteeCard />
    </div>
  );
};

export default PricingPlans;
