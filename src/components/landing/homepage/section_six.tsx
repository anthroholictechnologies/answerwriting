import ImpactSpan from "../../react-common/impact-span";
import { ButtonPrimary } from "./buttons/button_primary";
import Image from "next/image";

export const SectionSix = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-full w-full bg-gradient-to-b from-[#fbfeff] to-[#ecf8ff] gap-4 py-8 md:p-16">
      <div className="flex flex-col gap-10 text-secondary-dark mx-auto items-center max-w-5xl px-6 md:px-10 lg:px-20 lg:pt-20">
        <div className="flex flex-col items-center gap-10 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold tracking-tight leading-tight">
            Write Confidently, Score Higher with{" "}
            <span className="relative inline-block">
              <ImpactSpan text="AnswerWriting" />
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="12"
                viewBox="0 0 200 12"
              >
                <path
                  d="M2 8.5C50 2.5 150 2.5 198 8.5"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>{" "}
          </h2>
          <p className="text-lg lg:text-xl">
            Refine your UPSC Mains answers with precision. Our AI-driven
            evaluation ensures clarity, relevance, and structured
            writing—helping you improve with every attempt. Master the art of
            answer writing and boost your scores with actionable feedback.
          </p>
          <ButtonPrimary>
            {" "}
            {isLoggedIn
              ? `💎 Upgrade to Pro`
              : `✍🏻 Sign up now. It's free`}{" "}
          </ButtonPrimary>
        </div>
      </div>
      <div className="hidden xl:block">
        <Image
          src="/logo_1.webp"
          alt="answerwriting logo"
          width={400}
          height={400}
          className="w-[400px] h-[400px] object-contain"
        />
      </div>
    </div>
  );
};
