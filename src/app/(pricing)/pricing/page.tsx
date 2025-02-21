import FAQSection from "answerwriting/components/pricing/faq_pricing";
import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import { Brain, Calculator } from "lucide-react";
import Link from "next/link";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import PricingCards from "answerwriting/components/pricing/cards_pricing";
import GuaranteeCard from "answerwriting/components/pricing/gurantee";

export default async function PricingPage(): Promise<React.ReactNode> {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center gap-8 w-full p-4 py-16">
        <div>
          <h1 className="hidden md:block text-center text-4xl tracking-tighter font-bold mb-4">
            Enhance your <ImpactSpan text="Answers Writing" /> skill with{" "}
            <ImpactSpan text="Pro" />
          </h1>
          <div className="md:hidden text-center text-4xl tracking-tighter font-bold mb-4">
            <div>Enhance your</div>
            <div>
              <ImpactSpan text="Answers Writing" />
            </div>
            <div>
              skill with <ImpactSpan text="Pro" />
            </div>
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
          <div className="flex md:flex-row flex-col gap-4 font-bold text-primary-dark">
            <Link href={ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR} passHref>
              <div className="flex gap-1">
                <Brain className="h-6 w-6 text-primary-dark" /> AI Evaluator
              </div>
            </Link>
            <Link
              href={ApiRoutePaths.PAGE_DASHBOARD_TOOLS_WORD_COUNTER}
              passHref
            >
              <div className="flex gap-1">
                <Calculator className="h-5 w-5 text-primary-dark" /> Word
                Counter
              </div>
            </Link>
          </div>
        </div>
        <PricingCards userCurrentPlan="free" showUpgradeCTA />
        <GuaranteeCard />
        <FAQSection />
      </div>
      <Footer />
    </>
  );
}
