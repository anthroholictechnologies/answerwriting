"use client";

import { Typewriter } from "react-simple-typewriter";

export const TypewriterHeading = () => {
  return (
    <>
      <h1 className="hidden lg:block text-center text-secondary-dark text-[2rem] lg:text-[4rem] font-bold md:max-w-4xl tracking-tighter leading-tight">
        Master UPSC Mains Answer Writing with{" "}
        <span className="text-primary-dark">
          <Typewriter
            words={["AI Precision", "for Free"]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={100}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </span>
      </h1>

      <h1 className="lg:hidden text-center text-secondary-dark text-[2rem] lg:text-[4rem] font-bold md:max-w-4xl tracking-tighter leading-tight">
        <div> Master UPSC Mains Answer Writing </div>
        <div className="text-primary-dark">
          <Typewriter
            words={["with AI Precision", "for Free"]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={100}
            deleteSpeed={50}
            delaySpeed={2000}
          />
        </div>
      </h1>
    </>
  );
};
