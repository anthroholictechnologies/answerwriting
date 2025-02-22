import React from "react";
import { ButtonPrimary } from "../react-common/buttons/button_primary";
import { ButtonTertiary } from "../react-common/buttons/button_tertiary";

type Plan = {
  name: string;
  price: number;
  duration: string;
  savings?: string;
  highlight?: string;
  totalCost?: string;
};

const plans: Plan[] = [
  {
    name: "Annual",
    price: 199,
    duration: "per month",
    savings: "Save 33%",
    highlight: "Best Value",
    totalCost: "₹2,388 billed every 12 months",
  },
  {
    name: "Half-Yearly",
    price: 229,
    duration: "per month",
    savings: "Save 23%",
    totalCost: "₹1,374 billed every 6 months",
  },
  {
    name: "Quarterly",
    price: 249,
    duration: "per month",
    savings: "Save 17%",
    totalCost: "₹747 billed every 3 months",
  },
  {
    name: "Monthly",
    price: 299,
    duration: "per month",
  },
];

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => {
  return (
    <div
      className={`w-full py-4 border rounded-xl transition-all duration-300 hover:border-primary-dark 
      ${plan.highlight ? "bg-blue-50/30 border-blue-200" : "bg-white border-gray-200"}`}
    >
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Left Section */}
        <div className="p-4 lg:w-1/3 md:border-r border-gray-200">
          <div>
            <p className="font-semibold text-gray-800">{plan.name}</p>
            {plan.savings && (
              <p className="text-primary-dark font-medium text-sm mt-1">
                {plan.savings}
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-[90%] h-[150px] lg:h-[100px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full lg:w-auto">
            {plan.highlight && (
              <span className="inline-block text-primary-dark text-sm font-medium">
                {plan.highlight}
              </span>
            )}
            <div className="flex items-baseline flex-wrap">
              <span className="text-xl font-bold text-secondary-dark">
                ₹{plan.price}
              </span>
              <span className="ml-1 text-sm text-secondary-dark">INR</span>
              <span className="ml-2 text-sm text-secondary-dark">
                {plan.duration}
              </span>
            </div>
            {plan.totalCost && (
              <p className="text-gray-500 text-sm mt-1">{plan.totalCost}</p>
            )}
          </div>

          <div className="w-1/4 lg:w-auto">
            {plan.highlight ? (
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

const PricingPlans: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Select your plan
      </h2>
      <div className="w-full space-y-4">
        {plans.map((plan, index) => (
          <PlanCard key={index} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
