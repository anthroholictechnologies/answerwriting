import ImpactSpan from "../../react-common/impact-span";
import { ButtonPrimary } from "./buttons/button_primary";

export const SectionThree = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div className="flex flex-col gap-10 text-secondary-dark mx-auto items-center max-w-5xl px-6 md:px-10 lg:px-20 pt-16 lg:pt-20">
      {isLoggedIn ? (
        <>
          <div className="flex flex-col items-center text-center md:text-left gap-4">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              Go Pro{" "}
              <span className="relative inline-block">
                <ImpactSpan text="Score" />
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
              more
            </h2>
            <p className="text-lg lg:text-xl">
              Upgrade to advanced answer evaluation, deep insights, and
              unlimited practice.
            </p>
          </div>
          <ButtonPrimary> 💎 Upgrade to Pro </ButtonPrimary>
        </>
      ) : (
        <div className="flex flex-col items-center gap-10 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold tracking-tight leading-tight">
            AI that Evaluates{" "}
            <span className="relative inline-block">
              <ImpactSpan text="Faster & Better" />
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
            than your Coaching Institutes
          </h2>
          <p className="text-lg lg:text-xl">
            AnswerWriting works alongside you to analyze, evaluate, and enhance
            your UPSC Mains answers. Our AI-powered feedback ensures your
            answers are structured, relevant, and impactful—helping you improve
            without replacing your unique thought process.
          </p>
          <ButtonPrimary>
            {" "}
            <> {`✍🏻 Sign up now. It's free`} </>{" "}
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
};
