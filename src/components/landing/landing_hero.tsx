import { Button } from "../ui/button";
import Image from "next/image";

const LandingHero = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-8 py-4 px-2 xl:px-24">
        <h1 className="text-center text-[2rem] lg:text-[4rem] font-bold max-w-4xl tracking-tighter leading-tight">
          Master UPSC Mains Answer Writing with{" "}
          <span className="text-primary"> AI Precision. </span>
        </h1>

        <p className="text-tertiary text-center text-lg">
          Your Personalized Answer Evaluation Tool for Daily Practice, Crafted
          for UPSC Aspirants.
        </p>

        <div className="flex gap-4">
          <Button variant="transparent" size="lg">
            {" "}
            Free Evaluation{" "}
          </Button>
          <Button size="lg"> How it works ? </Button>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto mt-8 mb-8 lg:mb-48 p-4">
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

      <div className="py-24 p-8  flex flex-col xl:flex-row items-center gap-16 xl:gap-0 bg-[#16011b]">
        {/* Left: Smaller Image Card */}
        <div className="w-full xl:w-[40%] flex justify-center">
          <div className="w-[500px] h-[350px] bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&w=300&q=80"
              alt="AI Evaluation"
              className="w-full h-full object-cover"
              width={500}
              height={350}
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-center gap-4 xl:px-12 xl:py-8 w-full xl:w-[60%] text-center xl:text-left">
          <h1 className="text-[1.8rem] xl:text-[2.5rem] text-left text-white font-bold tracking-tighter leading-tight">
            Tired of waiting for Teachers to Evaluate Your Answers?{" "}
            <span className="text-primary">Everyone Is.</span>
          </h1>
          <p className="text-white text-left">
            {`With AnswerWriting, we’ve created an all-in-one AI-powered platform that doesn’t just assist—it assesses, analyzes, and enhances. By leveraging cutting-edge AI, we streamline the evaluation process, providing accurate and insightful feedback across your entire learning journey.`}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4">
            <Button size="lg" className="hover:cursor-pointer">
              Start evaluating now
            </Button>
            <Button
              variant="transparent"
              size="lg"
              className="hover:cursor-pointer"
            >
              <i>Eliminate waiting time</i>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingHero;
