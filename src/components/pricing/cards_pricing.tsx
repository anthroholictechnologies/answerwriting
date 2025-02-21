import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import { Check } from "lucide-react";
import { PricingToolTip } from "answerwriting/components/pricing/tooltip_pricing";
import { ApiRoutePaths, PlanType } from "answerwriting/types/general.types";
import { ButtonPrimary } from "../react-common/buttons/button_primary";
import Link from "next/link";

type Feature = {
  d: string;
  t: string;
};

type PricingCardProps = {
  title: string;
  price: string;
  features: (string | Feature)[];
  isCurrentPlan: boolean;
  heading: string;
  featHeading: string;
  showUpgradeButton?: boolean;
};

const freeFeatures: string[] = [
  "Evaluate up to 2 answers per month (Free Plan)",
  "Get instant AI-powered feedback",
  "Improve your answers for higher scores",
  "Save and review answers for 1 day (Free Plan)",
  "Upgrade for unlimited answer evaluations",
  "Access a free word counter for better writing",
];

const proFeatures = [
  {
    d: "Unlimited AI Answer Evaluations",
    t: "Get instant feedback on as many answers as you want",
  },
  {
    d: "5 Human-Evaluated Answers per Month",
    t: "Get expert feedback from real teachers",
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
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-4">
        <CardTitle className="font-bold text-2xl">{title}</CardTitle>
        <CardDescription className="flex flex-col items-center gap-4">
          <p className="text-center text-sm max-w-64 text-secondary-dark">
            {heading}
          </p>
          <div className="flex flex-col">
            <div className="flex">
              <p className="font-bold text-4xl text-primary-dark">{price}</p>
              <p className="font-bold text-md text-primary-dark">INR</p>
            </div>
            <p className="text-md mx-auto">per month</p>
          </div>
          {isCurrentPlan && (
            <p className="bg-primary-dark text-sm rounded-full shadow-md text-white px-4 py-1">
              Current Plan
            </p>
          )}

          {showUpgradeButton && (
            <Link href={ApiRoutePaths.PAGE_UPGRADE} passHref>
              <ButtonPrimary> 💎 Upgrade to Pro </ButtonPrimary>
            </Link>
          )}

          <div className="flex gap-1">
            <p>3 days money back guarantee</p>
            <PricingToolTip text="Try pro for 3 days. If you're not happy, we'll give you a full refund." />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="font-bold mb-4">{featHeading}</h1>
        <div className="flex flex-col gap-4">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-2">
              <Check className="text-green-500" />
              <div className="flex gap-4 w-full justify-between">
                {typeof feature === "string" ? (
                  feature
                ) : (
                  <>
                    <span>{feature.d}</span> <PricingToolTip text={feature.t} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PricingCards = ({
  userCurrentPlan,
  showUpgradeCTA,
}: {
  userCurrentPlan: PlanType;
  showUpgradeCTA?: boolean;
}) => {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-8">
      <PricingCard
        title="Free"
        price="₹0"
        features={freeFeatures}
        isCurrentPlan={userCurrentPlan === "free"}
        heading="Evaluate answers, improve instantly, and track your progress"
        featHeading="Features you’ll love:"
      />
      <PricingCard
        title="✍️ Pro"
        price="₹199"
        features={proFeatures}
        isCurrentPlan={userCurrentPlan === "pro"}
        heading="Write better, score higher, and improve without limits"
        featHeading="Everything included in the free plan, plus:"
        showUpgradeButton={showUpgradeCTA == true && userCurrentPlan === "free"}
      />
    </div>
  );
};

export default PricingCards;
