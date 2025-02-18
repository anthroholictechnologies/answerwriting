import { DiamondPlusIcon } from "lucide-react";
import ImpactSpan from "../react-common/impact-span";
import { Button } from "../ui/button";

export const SectionThree = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <>
      {/* Section 3 */}
      <div className="flex flex-col gap-8  mx-auto items-center max-w-4xl py-16 lg:py-20 lg:mb-16 mb-8 px-4 ">
        {isLoggedIn ? (
          <>
            <div className="flex flex-col items-center gap-2">
              <div className="text-[2rem] lg:text-[2.5rem] font-bold lg:text-left tracking-tighter leading-tight">
                Go Pro <ImpactSpan text="Score" /> more
              </div>
              <div className="text-tertiary text-center text-lg">
                Upgrade to advanced answer evaluation, deep insights, and
                unlimited practice
              </div>
            </div>
            <Button size="lg" className="flex gap-2 px-16">
              <DiamondPlusIcon className="h-4 w-4" />
              Get Pro
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <div className="text-center text-[1.5rem] lg:text-[2.5rem] font-bold tracking-tighter leading-tight relative">
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
              than your Coaching Institutes{" "}
            </div>
            <Button size="lg" className="flex gap-2 px-8 text-md font-bold">
              {` Sign up now. It’s free!`}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
