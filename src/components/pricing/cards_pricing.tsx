"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import { Check, RocketIcon, X } from "lucide-react";
import { PricingToolTip } from "answerwriting/components/pricing/tooltip_pricing";
import { Plans, PlanType } from "answerwriting/types/payment.types";
import { maxBy } from "lodash";
import {
  convertPaisaToRupee,
  getDurationMonths,
} from "answerwriting/lib/utils";
import { ButtonPrimary } from "../react-common/buttons/button_primary";
import {
  ApiRoutePaths,
  Feature,
  UserDetailProp,
} from "answerwriting/types/general.types";
import Link from "next/link";
import { freeFeatures, proFeatures } from "answerwriting/config";

type PricingCardProps = {
  title: string;
  price: string;
  features: Feature[];
  isCurrentPlan: boolean;
  heading: string;
  featHeading: string;
  isProPlan?: boolean;
  isLoggedIn: boolean;
  isPricingPage?: boolean;
  isProUser?: boolean;
};

const PricingDetails = ({
  price,
  isCurrentPlan,
  showProPlanDetails,
}: {
  price: string;
  isCurrentPlan: boolean;
  showProPlanDetails: boolean;
}) => {
  return (
    <div>
      <div className="text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl sm:text-4xl font-bold text-secondary-dark">
            {price}
          </span>
          <span className="text-lg font-semibold text-secondary-dark">INR</span>
        </div>
        <p className="mt-1 text-sm">Per month</p>
      </div>
      {isCurrentPlan && (
        <div className="flex justify-center mt-2">
          <span className="bg-green-400 text-xs rounded-full px-3 py-1 text-white shadow">
            Current Plan
          </span>
        </div>
      )}
      {showProPlanDetails && (
        <div className="flex flex-col items-center gap-4 mt-2 px-4 sm:px-6">
          <Link href={ApiRoutePaths.PAGE_UPGRADE}>
            <ButtonPrimary>
              <div className="flex gap-2 items-center">
                <RocketIcon className="h-6 w-6" />
                Upgrade to Pro
              </div>
            </ButtonPrimary>
          </Link>
          <div className="flex items-center justify-center gap-1 text-sm text-center">
            <span>3 days money back guarantee</span>
            <PricingToolTip text="Try pro for 3 days. If you're not happy, we'll give you a full refund." />
          </div>
        </div>
      )}
    </div>
  );
};

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  isCurrentPlan,
  heading,
  featHeading,
  isProPlan = false,
  isProUser,
  isPricingPage = false,
}) => {
  return (
    <Card className="w-full h-full flex flex-col bg-white overflow-hidden">
      <CardHeader className="px-4 py-6 sm:px-6 text-center">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold justify-center">
          {isProPlan && <RocketIcon />} {title}
        </CardTitle>
        <CardDescription className="space-y-4">
          <p className="text-center text-sm text-secondary-dark max-w-xs mx-auto">
            {heading}
          </p>
          {isPricingPage && (
            <PricingDetails
              price={price}
              isCurrentPlan={isCurrentPlan}
              showProPlanDetails={isProPlan && !isProUser}
            />
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow px-4 pb-6 sm:px-6 space-y-2 py-4">
        <h2 className="font-bold mb-4">{featHeading}</h2>
        <ul className="space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1">
                {feature.available ? (
                  <Check size={20} className="text-green-500" />
                ) : (
                  <X size={20} className=" text-red-500" />
                )}
              </span>
              <div className="flex items-center justify-between w-full gap-2">
                {typeof feature === "string" ? (
                  <span className={`${isPricingPage ? "text-md" : "text-sm"}`}>
                    {feature}
                  </span>
                ) : (
                  <>
                    <span
                      className={`${isPricingPage ? "text-md" : "text-sm"}`}
                    >
                      {feature.description}
                    </span>
                    {feature.tooltip && (
                      <div className="shrink-0">
                        <PricingToolTip text={feature.tooltip} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const PricingCards = ({
  isPricingPage = false,
  plans,
  userDetails,
}: {
  isPricingPage?: boolean;
  plans: Plans[];
  userDetails: UserDetailProp;
}) => {
  const bestBillingOptionFree = maxBy(
    plans.find((p) => p.name === PlanType.FREE)?.products ?? [],
    (bo) => bo.discountPercentage,
  );
  const bestBillingOptionPro = maxBy(
    plans.find((p) => p.name === PlanType.PRO)?.products ?? [],
    (bo) => bo.discountPercentage,
  );
  const priceForFree = bestBillingOptionFree
    ? convertPaisaToRupee(
        bestBillingOptionFree.totalPrice /
          getDurationMonths(bestBillingOptionFree.duration),
      )
    : 0;
  const priceForPro = bestBillingOptionPro
    ? convertPaisaToRupee(
        bestBillingOptionPro.totalPrice /
          getDurationMonths(bestBillingOptionPro.duration),
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <PricingCard
          title="Free"
          price={`₹${priceForFree}`}
          features={freeFeatures}
          isCurrentPlan={!userDetails.isProUser}
          heading="Evaluate answers, improve instantly, and track your progress"
          featHeading="Features you'll love:"
          isLoggedIn={!!userDetails.isLoggedIn}
          isProUser={!!userDetails.isProUser}
          isPricingPage={isPricingPage}
        />
        <PricingCard
          title="Pro"
          price={`₹${priceForPro}`}
          features={proFeatures}
          isCurrentPlan={!!userDetails.isProUser}
          heading="Write better, score higher, and improve without limits"
          featHeading="Everything included in the free plan, plus:"
          isLoggedIn={!!userDetails.isLoggedIn}
          isProUser={!!userDetails.isProUser}
          isProPlan
          isPricingPage={isPricingPage}
        />
      </div>
    </div>
  );
};

export default PricingCards;
