import React from "react";
import { ButtonPrimary } from "../react-common/buttons/button_primary";
import { ButtonTertiary } from "../react-common/buttons/button_tertiary";
import { BillingOptions, Duration } from "answerwriting/types/payment.types";
import { maxBy, orderBy } from "lodash";
import {
  convertPaisaToRupee,
  getDurationMonths,
} from "answerwriting/lib/utils";

function formatduration(duration: Duration) {
  switch (duration) {
    case Duration.ANNUAL:
      return "Annual";
      break;
    case Duration.HALF_YEARLY:
      return "Half-Yearly";
      break;
    case Duration.QUATERLY:
      return "Quaterly";
      break;
    case Duration.MONTHLY:
      return "Monthly";
      break;
  }
}

const BillingOptionCard: React.FC<{
  bo: BillingOptions;
  bestPlan: string;
}> = ({ bo, bestPlan }) => {
  return (
    <div
      className={`w-full mx-auto py-4 sm:py-0 border rounded-xl transition-all duration-300 hover:border-primary-dark 
      ${bestPlan ? "bg-blue-50/30 border-blue-200" : "bg-white border-gray-200"}`}
    >
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Left Section */}
        <div className="p-4 lg:w-1/3 md:border-r border-gray-200">
          <div>
            <p className="font-semibold text-gray-800">
              {formatduration(bo.duration)}
            </p>
            {bo.discountPercentage !== 0 && (
              <p className="text-primary-dark font-medium text-sm mt-1">
                Save {bo.discountPercentage}%
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-[90%] h-[150px] lg:h-[100px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full lg:w-auto">
            {bestPlan && (
              <span className="inline-block text-primary-dark text-sm font-medium">
                {bestPlan}
              </span>
            )}
            <div className="flex items-baseline flex-wrap">
              <span className="text-xl font-bold text-secondary-dark">
                ₹
                {convertPaisaToRupee(bo.totalPrice) /
                  getDurationMonths(bo.duration)}
              </span>
              <span className="ml-1 text-sm text-secondary-dark">INR</span>
              <span className="ml-2 text-sm text-secondary-dark">
                per month
              </span>
            </div>
            {bo.totalPrice && getDurationMonths(bo.duration) > 1 && (
              <p className="text-gray-500 text-sm mt-1">
                ₹{convertPaisaToRupee(bo.totalPrice)} billed every{" "}
                {getDurationMonths(bo.duration)} months
              </p>
            )}
          </div>

          <div className="w-1/4 lg:w-auto">
            {bestPlan ? (
              <ButtonPrimary>Select</ButtonPrimary>
            ) : (
              <ButtonTertiary>Select</ButtonTertiary>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingPlans = ({
  billingOptions,
}: {
  billingOptions: BillingOptions[];
}) => {
  const bestPlan = maxBy(billingOptions, (bo) => bo.discountPercentage);
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Select your plan
      </h2>
      <div className="w-full space-y-4">
        {orderBy(billingOptions, (bo) => bo.discountPercentage, ["desc"]).map(
          (bo, index) => (
            <BillingOptionCard
              key={index}
              bo={bo}
              bestPlan={bestPlan?.id === bo.id ? "Best Value" : ""}
            />
          )
        )}
      </div>
    </div>
  );
};

export default PricingPlans;
