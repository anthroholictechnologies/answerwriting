import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";
import PricingCards from "answerwriting/components/pricing/cards_pricing";
import PricingPlans from "answerwriting/components/pricing/plans_pricing";
import GuaranteeCard from "answerwriting/components/pricing/gurantee";
import { auth } from "answerwriting/auth";

export default async function Upgrade(): Promise<React.ReactNode> {
  const session = await auth();
  return (
    <>
      <Header isLoggedIn={!!session} />
      <div className="flex flex-col-reverse mx-auto w-full xl:max-w-6xl xl:flex-row  gap-8 p-4 py-16">
        <div className="flex justify-center w-full xl:w-1/2">
          <PricingCards userCurrentPlan="free" isLoggedIn={!!session} />
        </div>

        <div className="w-full space-y-6 xl:w-1/2">
          <PricingPlans />
          <GuaranteeCard />
        </div>
      </div>
      <Footer />
    </>
  );
}
