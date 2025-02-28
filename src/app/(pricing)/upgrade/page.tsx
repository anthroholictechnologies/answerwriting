import PricingCards from "answerwriting/components/pricing/cards_pricing";
import PricingPlans from "answerwriting/components/pricing/plans_pricing";
import { auth } from "answerwriting/auth";
import { getPlans, proUser } from "answerwriting/actions";
import { PlanType } from "answerwriting/types/payment.types";

export default async function Upgrade(): Promise<React.ReactNode> {
  const session = await auth();
  const plans = await getPlans();
  const { isProUser, hasPendingOrder, transactionId } = await proUser(
    session?.user?.id,
  );

  return (
    <>
      <div className="flex flex-col-reverse mx-auto w-full xl:max-w-6xl xl:flex-row  gap-8 p-4 xl:py-16">
        <div className="flex justify-center w-full xl:w-1/2">
          <PricingCards
            userDetails={{ isLoggedIn: !!session, isProUser: isProUser }}
            plans={plans}
          />
        </div>
        <div className="w-full space-y-6 xl:w-1/2">
          <PricingPlans
            products={
              plans.find((p) => p.name === PlanType.PRO)?.products ?? []
            }
            userDetails={{
              isLoggedIn: !!session,
              isProUser: isProUser,
              hasPendingOrder: hasPendingOrder,
              transactionId,
            }}
          />
        </div>
      </div>
    </>
  );
}
