"use client";
import React, { useMemo } from "react";
import { ButtonTertiary } from "../react-common/buttons/button_tertiary";
import { Product, Duration } from "answerwriting/types/payment.types";
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
import {
  ApiRoutePaths,
  ErrorCodes,
  UserDetailProp,
} from "answerwriting/types/general.types";
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

const PriceDetails: React.FC<{ product: Product; isBestPlan: boolean }> = ({
  product,
  isBestPlan,
}) => (
  <div className="w-full lg:w-auto">
    {isBestPlan && (
      <span className="inline-block text-primary-dark text-sm font-bold">
        Best Value
      </span>
    )}
    <div className="flex items-baseline flex-wrap">
      <span className="text-xl font-bold text-secondary-dark">
        ₹
        {convertPaisaToRupee(product.totalPrice) /
          getDurationMonths(product.duration)}
      </span>
      <span className="ml-1 text-sm text-secondary-dark">INR</span>
      <span className="ml-2 text-sm text-secondary-dark">per month</span>
    </div>
    {product.totalPrice && getDurationMonths(product.duration) > 1 && (
      <p className="text-gray-500 text-sm mt-1">
        ₹{convertPaisaToRupee(product.totalPrice)} billed every{" "}
        {getDurationMonths(product.duration)} months
      </p>
    )}
  </div>
);

const SelectButton: React.FC<{
  product: Product;
  isBestPlan: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
  isLoading: boolean;
  selectedProduct: string | null;
}> = ({
  product,
  isBestPlan,
  onSelect,
  disabled,
  isLoading,
  selectedProduct,
}) => {
  const ButtonComponent = isBestPlan ? ButtonTertiary : ButtonTertiary;
  const isSelected = selectedProduct === product.id;

  return (
    <ButtonComponent
      onClick={() => onSelect(product.id)}
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

const ProductCard: React.FC<{
  product: Product;
  isBestPlan: boolean;
  onSelect: (id: string) => void;
  userDetails: UserDetailProp;
  isLoading: boolean;
  selectedProduct: string | null;
}> = ({
  product,
  isBestPlan,
  onSelect,
  userDetails,
  isLoading,
  selectedProduct,
}) => {
  const isSelected = selectedProduct === product.id;
  return (
    <div
      className={`w-full mx-auto py-4 sm:py-0 border rounded-xl transition-all duration-300 
      ${
        isSelected && isLoading
          ? "border-primary-dark shadow-md"
          : isBestPlan
            ? "hover:border-primary-dark bg-blue-50/30 border-blue-200"
            : "hover:border-primary-dark bg-white border-gray-200"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Left Section */}
        <div className="p-4 lg:w-1/3 md:border-r border-gray-200">
          <p className="font-semibold text-gray-800">
            {formatDuration(product.duration)}
          </p>
          {product.discountPercentage !== 0 && (
            <p className="text-primary-dark font-medium text-sm mt-1">
              Save {product.discountPercentage}%
            </p>
          )}
        </div>

        {/* Right Section */}
        <div className="w-[90%] h-[150px] lg:h-[100px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <PriceDetails product={product} isBestPlan={isBestPlan} />
          <SelectButton
            product={product}
            isBestPlan={isBestPlan}
            onSelect={onSelect}
            disabled={
              !userDetails.isLoggedIn ||
              !!userDetails.isProUser ||
              !!userDetails.hasPendingOrder
            }
            isLoading={isLoading}
            selectedProduct={selectedProduct}
          />
        </div>
      </div>
    </div>
  );
};

const PricingPlans: React.FC<{
  products: Product[];
  userDetails: UserDetailProp;
}> = ({ products, userDetails }) => {
  const router = useRouter();
  const toast = useCustomToast();

  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(
    null,
  );

  const [{ loading: isLoading }, initiatePayment] = useAsyncFn(
    async (id: string) => {
      try {
        setSelectedProduct(id);
        const response = await upgradeToPro({ productId: id });

        if (!response.success) {
          setSelectedProduct(null);
          const errorMessages: Record<
            string,
            { title: string; description: string }
          > = {
            [ErrorCodes.UNAUTHORIZED]: {
              title: "Login required",
              description: "Please login to purchase the subscription.",
            },
            [ErrorCodes.USER_ALREADY_HAS_ACTIVE_SUBSCRIPTION]: {
              title: "You are already a PRO user",
              description: "Please head back to Dashboard.",
            },
            [ErrorCodes.ORDER_ALREADY_PENDING]: {
              title:
                "Payment Pending. Please wait for 24 hours for confirmation",
              description:
                "We are processing with your current payment. Please wait for a while before trying",
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
        setSelectedProduct(null);
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
    },
  );

  const handleSelect = (id: string) => initiatePayment(id);

  const bestPlan = useMemo(
    () => maxBy(products, (p) => p.discountPercentage),
    [products],
  );

  const selectedPlanDetails = useMemo(() => {
    if (!selectedProduct) return null;
    return products.find((bo) => bo.id === selectedProduct);
  }, [selectedProduct, products]);

  const selectedPlanName = selectedPlanDetails
    ? formatDuration(selectedPlanDetails.duration)
    : "";

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 relative">
      {isLoading && selectedProduct && (
        <LoadingOverlay selectedPlanName={selectedPlanName} />
      )}

      <h2 className="text-3xl font-bold text-secondary-dark mb-8">
        Select your plan
      </h2>
      {!userDetails.isLoggedIn && (
        <EnhancedAlert
          variant="destructive"
          title="Please log in to your account to continue."
          description="Please log in to your account to upgrade to PRO."
          icon={<LogIn className="h-5 w-5 text-red-800" />}
          action={
            <Link href="/login">
              <ButtonTertiary classes="whitespace-nowrap text-red-800 border-red-800">
                <span className="flex items-center">
                  Log In <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </ButtonTertiary>
            </Link>
          }
        />
      )}
      {userDetails.isProUser && (
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
      {userDetails.hasPendingOrder && (
        <EnhancedAlert
          variant="destructive"
          title="Please wait for next 24 hours."
          description="We are proccessing your payment."
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          action={
            <Link
              href={`${ApiRoutePaths.PAGE_PAYMENT_STATUS}?id=${userDetails.transactionId}`}
            >
              <ButtonTertiary classes="whitespace-nowrap text-red-500 border-red-500">
                <span className="flex items-center">
                  Check Status <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </ButtonTertiary>
            </Link>
          }
        />
      )}
      <div className="w-full space-y-4">
        {orderBy(products, "discountPercentage", "desc").map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isBestPlan={bestPlan?.id === product.id}
            onSelect={handleSelect}
            userDetails={userDetails}
            isLoading={isLoading}
            selectedProduct={selectedProduct}
          />
        ))}
      </div>
      <GuaranteeCard />
    </div>
  );
};

export default PricingPlans;
