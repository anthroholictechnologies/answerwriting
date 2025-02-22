import FAQSection from "answerwriting/components/pricing/faq_pricing";
import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";
import { Brain, Calculator } from "lucide-react";
import Link from "next/link";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import PricingCards from "answerwriting/components/pricing/cards_pricing";
import GuaranteeCard from "answerwriting/components/pricing/gurantee";
import { auth } from "answerwriting/auth";

export default async function PricingPage(): Promise<React.ReactNode> {
  const session = await auth();
  return (
    <>
      <Header isLoggedIn={!!session} />
      <div className="flex flex-col items-center gap-6 w-full p-4 py-16">
        <div>
          <h1 className="hidden md:block text-center text-4xl tracking-tighter font-bold mb-4">
            Enhance your Answers Writing skill with Pro
          </h1>
          <div className="md:hidden text-center text-4xl tracking-tighter font-bold mb-4">
            <div>Enhance your</div>
            <div>Answer Writing</div>
            <div>skill with Pro</div>
          </div>
          <p className="text-center text-md md:text-xl text-secondary-dark">
            Score higher, write better, and improve faster with AI-powered
            evaluations
          </p>
        </div>

        <div>
          <p className="text-center text-md text-secondary-dark mb-4">
            Pro plan includes:
          </p>
          <div className="flex md:flex-row flex-col gap-4 font-bold text-secondary-dark">
            <Link href={ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR} passHref>
              <div className="flex gap-1">
                <Brain className="h-6 w-6" /> AI Evaluator
              </div>
            </Link>
            <Link
              href={ApiRoutePaths.PAGE_DASHBOARD_TOOLS_WORD_COUNTER}
              passHref
            >
              <div className="flex gap-1">
                <Calculator className="h-5 w-5" /> Word Counter
              </div>
            </Link>
          </div>
        </div>
        <PricingCards
          userCurrentPlan="free"
          isLoggedIn={!!session}
          pricingPage
        />
        <div>
          <GuaranteeCard />
        </div>
        <FAQSection />
      </div>
      <Footer />
    </>
  );
}
