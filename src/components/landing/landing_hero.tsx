import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import TypewriterHeading from "./hero_heading";

const LandingHero = () => {
  return (
    <>
      {/* First Section - Header */}
      <div className="flex flex-col items-center gap-8 px-2 pt-16 md:px-24 md:pt-24">
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

      {/* Second Section - Video */}
      <div className="w-full max-w-6xl mx-auto mt-8 mb-16 lg:mb-40 p-4">
        <div className="relative w-full aspect-video border-8 border-primary drop-shadow-[0_0_12px_rgba(45,128,246,0.8)] rounded-3xl overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/nFvYEwlg3PA?si=mw450-El8gkrPK_k"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Third Section - Features */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/auth-image.webp"
            alt=""
            width={1080}
            height={1080}
            className="w-full h-full object-cover scale-110 blur-md brightness-95"
          />
          <div className="absolute inset-0 bg-[#000000]/65 backdrop-blur-xl" />
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center  gap-16 lg:flex-row  lg:gap-12">
            {/* Left Section */}
            <div className="relative w-full lg:w-2/5">
              <div className="relative overflow-hidden">
                <Image
                  src="/auth-image.webp"
                  alt="AI Evaluation Platform"
                  className="object-contain aspect-[4/3] h-full w-full lg:w-[600px] lg:h-[400px]"
                  width={1080}
                  height={1080}
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="flex flex-col items-center lg:items-start w-full lg:w-3/5 space-y-8">
              <h2 className="text-[2rem] lg:text-[2.5rem] font-bold text-white text-center lg:text-left tracking-tighter leading-tight">
                Tired of waiting for Teachers to Evaluate Your Answers?{" "}
                <span className="text-primary">Everyone Is.</span>
              </h2>

              <p className="text-white text-center lg:text-left text-lg">
                {`With AnswerWriting, we've created an all-in-one AI-powered
                platform that doesn't just assist—it assesses, analyzes, and
                enhances. By leveraging cutting-edge AI, we streamline the
                evaluation process, providing accurate and insightful feedback
                across your entire learning journey.`}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full lg:w-auto">
                <Button size="lg">Start evaluating now</Button>
                <Button variant="transparent" size="lg">
                  <i>Eliminate waiting time</i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingHero;
