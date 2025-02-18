import Link from "next/link";
import { Button } from "../ui/button";
import TypewriterHeading from "./hero_heading";
import { ApiRoutePaths } from "answerwriting/types/general.types";

export const SectionOne = () => {
  return (
    <>
      {/* Section 1  */}
      <div className="flex flex-col mx-auto max-w-6xl xl:max-w-12xl py-16 md:py-24 lg:mb-16 mb-8 px-4 md:px-16">
        <div className="flex flex-col items-center gap-8 px-2">
          <TypewriterHeading />
          <p className="text-tertiary text-center text-lg">
            Your Personalized Answer Evaluation Tool for Daily Practice, Crafted
            for UPSC Aspirants
          </p>
          <div className="flex gap-4">
            <Button variant="transparent" size="lg">
              <Link href={ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR}>
                Free Evaluation{" "}
              </Link>
            </Button>
            <Button size="lg">How it works?</Button>
          </div>
        </div>
        <div className="w-full mx-auto mt-12">
          <div className="relative w-full aspect-video border-8 border-primary drop-shadow-[0_0_12px_rgba(45,128,246,0.8)] rounded-3xl overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/nFvYEwlg3PA?si=mw450-El8gkrPK_k"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};
