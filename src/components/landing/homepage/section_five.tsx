import Image from "next/image";
import { ButtonSecondary } from "./buttons/button_secondary";

export const SectionFive = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <section className="flex flex-col bg-[#364e8a] lg:flex-row items-center justify-center mx-auto px-6 md:px-12 lg:px-20 xl:px-32 py-16 gap-12 max-w-screen-xl">
      {/* Image Container */}
      <div className="flex-1 flex justify-center">
        <div className="overflow-hidden w-full max-w-md md:max-w-lg lg:max-w-xl">
          <Image
            src="/homepage_sectionfive.webp"
            alt="Answer evaluation illustration"
            width={900}
            height={800}
            className="object-cover w-full h-auto"
          />
        </div>
      </div>

      {/* Text & CTA Section */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
          Precise Feedback for{" "}
          <span className="text-pink-200">Better Answers</span>
        </h1>

        <p className="text-white text-lg lg:text-xl max-w-xl">
          {`Write. Evaluate. Improve. AnswerWriting helps you master the art of answer writing by providing instant, AI-driven feedback. Whether you aim to refine your structure, enhance clarity, or meet UPSC standards, our platform guides you at every step.

`}
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center w-full px-10">
          {isLoggedIn ? (
            <ButtonSecondary> 💎 Upgrade to Pro </ButtonSecondary>
          ) : (
            <ButtonSecondary>
              {" "}
              <> {`✍🏻 Sign up now. It's free`} </>{" "}
            </ButtonSecondary>
          )}
        </div>
      </div>
    </section>
  );
};
