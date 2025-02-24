import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";
import PricingCards from "answerwriting/components/pricing/cards_pricing";
import PricingPlans from "answerwriting/components/pricing/plans_pricing";
import { auth } from "answerwriting/auth";
import { getPlans } from "answerwriting/actions";
import { PlanType } from "answerwriting/types/payment.types";

export default async function Upgrade(): Promise<React.ReactNode> {
  const session = await auth();
  const plans = await getPlans();
  return (
    <>
      <Header isLoggedIn={!!session} />
      <div className="flex flex-col-reverse mx-auto w-full xl:max-w-6xl xl:flex-row  gap-8 p-4 xl:py-16">
        <div className="flex justify-center w-full xl:w-1/2">
          <PricingCards
            userCurrentPlan={PlanType.FREE}
            isLoggedIn={!!session}
            plans={plans}
          />
        </div>
        <div className="w-full space-y-6 xl:w-1/2">
          <PricingPlans
            billingOptions={
              plans.find((p) => p.name === PlanType.PRO)!.billingOptions
            }
          />        
        </div>
      </div>
      <Footer />
    </>
  );
}
