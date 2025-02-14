"use client";

import { Typewriter } from "react-simple-typewriter";

export default function TypewriterHeading() {
  return (
    <h1 className="text-center text-[2.5rem] lg:text-[4rem] font-bold md:max-w-4xl tracking-tighter leading-tight">
      Master UPSC Mains Answer Writing{" "}
      <span className="text-primary-dark">
        <Typewriter
          words={["with AI Precision", "for Free"]}
          loop={true}
          cursor
          cursorStyle="|"
          typeSpeed={100}
          deleteSpeed={50}
          delaySpeed={2000}
        />
      </span>
    </h1>
  );
}
