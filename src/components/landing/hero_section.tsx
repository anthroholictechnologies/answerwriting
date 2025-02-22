import Link from "next/link";
import { TypewriterHeading } from "./hero_heading";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import { ButtonPrimary } from "../react-common/buttons/button_primary";
export const Section_1 = () => {
  return (
    <section className="flex flex-col items-center mx-auto max-w-6xl xl:max-w-screen-xl pt-8 pb-16 md:py-24 px-6 md:px-12 lg:px-16">
      {/* Text Section */}
      <div className="flex flex-col items-center text-center gap-6">
        <TypewriterHeading />
        <p className="text-secondary-dark text-lg md:text-xl max-w-2xl">
          Your Personalized Answer Evaluation Tool for Daily Practice, Crafted
          for UPSC Aspirants
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <ButtonPrimary styles="lg:px-12">
            <Link href={ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR}>
              <div className="flex items-center gap-1">Free Evaluation</div>
            </Link>
          </ButtonPrimary>
        </div>
      </div>

      {/* Video Section */}
      <div className="flex justify-center w-full mt-12">
        <div className="relative w-full max-w-5xl aspect-video border-8 border-primary drop-shadow-[0_0_12px_rgba(45,128,246,0.8)] rounded-3xl overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/29LnjZcAanY?si=XAVzwMy1v3esjOV1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};
