import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import { Check, RocketIcon, X } from "lucide-react";
import { PricingToolTip } from "answerwriting/components/pricing/tooltip_pricing";
import { CommonButton } from "../react-common/buttons/button_upgrade";
import { Plans, PlanType } from "answerwriting/types/payment.types";
import { maxBy } from "lodash";
import {
  convertPaisaToRupee,
  getDurationMonths,
} from "answerwriting/lib/utils";

type Feature = {
  d: string;
  t?: string; // Made tooltip text optional
  available?: boolean;
};

type PricingCardProps = {
  title: string;
  price: string;
  features: (string | Feature)[];
  isCurrentPlan: boolean;
  heading: string;
  featHeading: string;
  showUpgradeButton?: boolean;
  lucideIcon: React.ReactNode;
  isLoggedIn: boolean;
  pricingPage?: boolean;
};

const freeFeatures = [
  "Evaluate 1 answer every month",
  "Get instant AI-powered feedback",
  "Get Improved Model Answer",
  { d: "Human Expert Feedback", available: false },
  { d: "Answers saved forever", available: false },
];

const proFeatures = [
  {
    d: "Unlimited AI Answer Evaluations",
    t: "Get instant feedback on as many answers as you want",
  },
  {
    d: "Human Expert Fedback",
    t: "Get feedback from UPSC subject experts",
  },
  { d: "Saved Answers Forever", t: "Access your past evaluations anytime" },
  {
    d: "Advanced Answer Insights",
    t: "In-depth analysis to improve structure, coherence, and content",
  },
  {
    d: "Exclusive Writing Tips",
    t: "AI-powered suggestions to refine your answers",
  },
  {
    d: "Priority Support",
    t: "Faster responses and assistance whenever you need",
  },
];

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  isCurrentPlan,
  heading,
  featHeading,
  showUpgradeButton = false,
  lucideIcon,
  isLoggedIn,
  pricingPage = false,
}) => {
  return (
    <Card className="w-full h-full flex flex-col bg-white overflow-hidden">
      <CardHeader className="px-4 py-6 sm:px-6 text-center">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold justify-center">
          {lucideIcon} {title}
        </CardTitle>
        <CardDescription className="space-y-4">
          <p className="text-center text-sm text-secondary-dark max-w-xs mx-auto">
            {heading}
          </p>
          {pricingPage && (
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-secondary-dark">
                  {price}
                </span>
                <span className="text-lg font-semibold text-secondary-dark">
                  INR
                </span>
              </div>
              <p className="mt-1 text-sm">Per month</p>
            </div>
          )}
          {pricingPage && isCurrentPlan && (
            <div className="flex justify-center">
              <span className="bg-green-400 text-xs rounded-full px-3 py-1 text-white shadow">
                Current Plan
              </span>
            </div>
          )}
        </CardDescription>
      </CardHeader>

      {pricingPage && showUpgradeButton && (
        <div className="flex flex-col items-center gap-4 px-4 sm:px-6">
          <CommonButton
            isProUser={false}
            variant="primary"
            isLoggedIn={isLoggedIn}
          />
          <div className="flex items-center justify-center gap-1 text-sm text-center">
            <span>3 days money back guarantee</span>
            <PricingToolTip text="Try pro for 3 days. If you're not happy, we'll give you a full refund." />
          </div>
        </div>
      )}

      <CardContent className="flex-grow px-4 pb-6 sm:px-6 space-y-2 py-4">
        <h2 className="font-bold mb-4">{featHeading}</h2>
        <ul className="space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1">
                {typeof feature === "string" ||
                (typeof feature === "object" && feature.available !== false) ? (
                  <Check size={20} className="text-green-500" />
                ) : (
                  <X size={20} className=" text-red-500" />
                )}
              </span>
              <div className="flex items-center justify-between w-full gap-2">
                {typeof feature === "string" ? (
                  <span className={`${pricingPage ? "text-md" : "text-sm"}`}>
                    {feature}
                  </span>
                ) : (
                  <>
                    <span className={`${pricingPage ? "text-md" : "text-sm"}`}>
                      {feature.d}
                    </span>
                    {feature.t && (
                      <div className="shrink-0">
                        <PricingToolTip text={feature.t} />
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
  userCurrentPlan,
  pricingPage = false,
  isLoggedIn,
  plans,
}: {
  pricingPage?: boolean;
  userCurrentPlan: PlanType;
  isLoggedIn: boolean;
  plans: Plans[];
}) => {
  const bestBillingOptionFree = maxBy(
    plans.find((p) => p.name === PlanType.FREE)?.billingOptions ?? [],
    (bo) => bo.discountPercentage
  );
  const bestBillingOptionPro = maxBy(
    plans.find((p) => p.name === PlanType.PRO)?.billingOptions ?? [],
    (bo) => bo.discountPercentage
  );
  const priceForFree = bestBillingOptionFree
    ? convertPaisaToRupee(
        bestBillingOptionFree.totalPrice /
          getDurationMonths(bestBillingOptionFree.duration)
      )
    : 0;
  const priceForPro = bestBillingOptionPro
    ? convertPaisaToRupee(
        bestBillingOptionPro.totalPrice /
          getDurationMonths(bestBillingOptionPro.duration)
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <PricingCard
          title="Free"
          price={`₹${priceForFree}`}
          features={freeFeatures}
          isCurrentPlan={userCurrentPlan === PlanType.FREE}
          heading="Evaluate answers, improve instantly, and track your progress"
          featHeading="Features you'll love:"
          lucideIcon={<></>}
          isLoggedIn={isLoggedIn}
          pricingPage={pricingPage}
        />
        <PricingCard
          title="Pro"
          price={`₹${priceForPro}`}
          features={proFeatures}
          isCurrentPlan={userCurrentPlan === PlanType.PRO}
          heading="Write better, score higher, and improve without limits"
          featHeading="Everything included in the free plan, plus:"
          lucideIcon={<RocketIcon />}
          isLoggedIn={isLoggedIn}
          showUpgradeButton
          pricingPage={pricingPage}
        />
      </div>
    </div>
  );
};

export default PricingCards;
