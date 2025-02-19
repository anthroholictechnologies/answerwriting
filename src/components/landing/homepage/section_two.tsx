import Image from "next/image";
import { ButtonSecondary } from "./buttons/button_secondary";
import { ButtonPrimary } from "./buttons/button_primary";

export const SectionTwo = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center mx-auto bg-[#364e8a] px-6 md:px-12 lg:px-20 xl:px-32 py-16 gap-12 max-w-screen-xl">
      {/* Image Container */}
      <div className="flex-1 flex justify-center">
        <div className="bg-white shadow-md rounded-xl overflow-hidden w-full max-w-md md:max-w-lg lg:max-w-xl">
          <Image
            src="/homepage-sectiontwo.webp"
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
          Struggling to Get Your Answers Evaluated?{" "}
          <span className="text-pink-200">{`You're Not Alone`}</span>
        </h1>

        <p className="text-white text-lg lg:text-xl max-w-xl">
          {`With AnswerWriting, we’ve created an all-in-one AI-powered platform
          that doesn’t just assist—it assesses, analyzes, and enhances. By
          leveraging cutting-edge AI, we streamline the evaluation process,
          providing accurate and insightful feedback across your entire learning
          journey.`}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <ButtonPrimary>Start evaluating now</ButtonPrimary>
          <ButtonSecondary>
            Eliminate waiting time
          </ButtonSecondary>
        </div>
      </div>
    </section>
  );
};
