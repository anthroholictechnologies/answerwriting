import Link from "next/link";
import ImpactSpan from "../react-common/impact-span";
import Image from "next/image";
import React from "react";

const AuthHeader = ({ heading }: { heading?: React.ReactElement }) => {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      {/* Logo and tagline */}
      <div className="flex flex-col items-center">
        <Link href="/" passHref>
          <Image
            src="/logo_4.svg"
            alt="answerwriting.com logo"
            height={50}
            width={250}
            className="w-[90%] h-[100%] lg:h-[120%]"
          />
        </Link>
        <p className="text-balance -mt-2 text-[0.7rem] italic">
          Craft <ImpactSpan text="Better Answers" /> with AI Precision
        </p>
      </div>
      {/* Heading */}
      {heading && heading}
    </div>
  );
};

export default AuthHeader;
