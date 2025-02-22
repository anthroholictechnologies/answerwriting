import Container from "answerwriting/components/misc/misc_container";
import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import Link from "next/link";
import Image from "next/image";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import { auth } from "answerwriting/auth";

const FAQHeading = ({ heading }: { heading: string }) => {
  return (
    <h2 className="text-[1.5rem] text-primary-dark tracking-tighter font-bold mb-2">
      {heading}
    </h2>
  );
};

export default async function FAQ() {
  const session = await auth();
  return (
    <div className="h-screen w-screen">
      <Header isLoggedIn={!!session} />
      <Container>
        <>
          <h1 className="text-center text-[3rem] tracking-tighter font-bold leading-none mb-4">
            Frequently Asked <ImpactSpan text="Questions" />
          </h1>
          <Image
            src="/logo_3.webp"
            alt="Answerwriting logo"
            width={300}
            height={300}
          />

          <div className="flex flex-col gap-8">
            <div>
              <FAQHeading heading="General Questions" />
              <ol className="flex flex-col gap-4 list-decimal ml-5">
                <li>
                  <strong>What is AnswerWriting.com?</strong> <br />
                  AnswerWriting.com is an AI-powered platform that evaluates
                  answers instantly. It provides detailed feedback on structure,
                  relevance, clarity, and presentation, helping aspirants
                  improve their answer-writing skills.
                </li>
                <li>
                  <strong>How does AnswerWriting.com work?</strong> <br />
                  You upload a PDF or image of your handwritten answer, and our
                  AI analyzes it based on key UPSC evaluation criteria. It
                  provides structured feedback, highlights areas for
                  improvement, and helps refine your writing.
                </li>
                <li>
                  <strong>Is AnswerWriting.com free to use?</strong> <br />
                  Yes, we offer a free version with essential evaluation
                  features. However, premium plans unlock unlimited evaluations,
                  human feedback, and in-depth feedback.
                </li>
                <li>
                  <strong>
                    Can AnswerWriting.com replace human evaluators?
                  </strong>{" "}
                  <br />
                  {` Our AI provides instant, objective, and consistent feedback
                  based on UPSC standards. While it can’t fully replace human
                  evaluators, it significantly enhances self-assessment and
                  practice while matching human evaluation standards to a very
                  high accuracy.`}
                </li>
              </ol>
            </div>

            <div>
              <FAQHeading heading="Answer Evaluation & Feedback" />
              <ol className="flex flex-col gap-4 list-decimal ml-5">
                <li>
                  <strong>
                    What kind of feedback does AnswerWriting provide?
                  </strong>{" "}
                  <br />
                  Our AI evaluates your answer based on:
                  <ul className="list-disc ml-5">
                    <li>✅ Question Alignment</li>
                    <li>✅ Structure & Coherence</li>
                    <li>✅ Clarity & Precision</li>
                    <li>✅ Depth & Multi-Dimensionality</li>
                    <li>✅ Syllabus & PYQ Mapping</li>
                    <li>✅ Score Estimation & Improvement Tips</li>
                  </ul>
                </li>
                <li>
                  <strong>
                    Does AnswerWriting check grammar and spelling?
                  </strong>{" "}
                  <br />
                  Since UPSC Mains is handwritten, grammar and spelling checks
                  are not a primary focus. However, we provide feedback on
                  clarity, coherence, and overall readability.
                </li>
                <li>
                  <strong>Can I track my progress over time?</strong> <br />
                  Yes! Your past evaluations are saved, allowing you to compare
                  your performance and track improvements over time.
                </li>
              </ol>
            </div>

            <div>
              <FAQHeading heading="Usage & Features" />
              <ol className="flex flex-col gap-4 list-decimal ml-5">
                <li>
                  <strong>
                    Do I need to type my answers, or can I upload handwritten
                    ones?
                  </strong>{" "}
                  <br />
                  You can either upload a clear image or a PDF of your
                  handwritten answer for evaluation.
                </li>
                <li>
                  <strong>Does the platform support all subjects?</strong>{" "}
                  <br />
                  Currently, AnswerWriting focuses on UPSC Mains GS Papers. We
                  will expand to more subjects & Optional Papers soon.
                </li>
                <li>
                  <strong>How accurate is the AI evaluation?</strong>
                  <br />
                  Our AI is trained on UPSC evaluation patterns and delivers
                  objective, structured feedback.
                </li>
              </ol>
            </div>

            <div>
              <FAQHeading heading="Plans & Pricing" />
              <ol className="flex flex-col gap-4 list-decimal ml-5">
                <li>
                  <strong>What features are available in the free plan?</strong>{" "}
                  The free plan offers limited evaluations, basic feedback, and
                  score estimates. The Pro Plan provides unlimited inputs,
                  human-reviewed feedback, and detailed analysis.
                </li>
                <li>
                  <strong>How do I upgrade to Pro?</strong>
                  <br />
                  You can upgrade anytime by visiting the{" "}
                  <Link
                    href={ApiRoutePaths.PAGE_PRICING}
                    className="text-primary-dark"
                  >
                    {" "}
                    pricing page{" "}
                  </Link>{" "}
                  and selecting a Pro plan.
                </li>
                <li>
                  <strong>
                    {`Is there a refund policy if I’m not satisfied?`}
                  </strong>{" "}
                  <br />
                  Yes, we have a refund policy for Pro users under specific
                  conditions. Check our{" "}
                  <Link
                    href={ApiRoutePaths.PAGE_REFUND_PLOCIY}
                    className="text-primary-dark"
                  >
                    Refund Policy
                  </Link>{" "}
                  page for details.
                </li>
              </ol>
            </div>

            <div>
              <FAQHeading heading="Support & Troubleshooting" />
              <ol className="flex flex-col gap-4 list-decimal ml-5">
                <li>
                  <strong>
                    {`I’m facing an issue with the platform. How do I get help?`}
                  </strong>{" "}
                  <br />
                  Contact us via the{" "}
                  <Link
                    href={ApiRoutePaths.PAGE_CONTACT_US}
                    className="text-primary-dark"
                  >
                    Contact Page
                  </Link>{" "}
                  or email us at{" "}
                  <a
                    href="mailto:info@answerwriting.com"
                    className="text-primary-dark"
                  >
                    info@answerwriting.com
                  </a>
                  .
                </li>
                <li>
                  <strong>Is my data safe on AnswerWriting.com?</strong> <br />
                  Absolutely. We do not share your data with third parties, and
                  all your submitted answers are securely stored.
                </li>
              </ol>
            </div>
            <p>
              Still have questions?{" "}
              <Link
                href={ApiRoutePaths.PAGE_CONTACT_US}
                className="text-primary-dark"
              >
                {" "}
                Contact us{" "}
              </Link>
              , and {`we’ll be happy to assist you!`}
            </p>
          </div>
        </>
      </Container>
      <Footer />
    </div>
  );
}
