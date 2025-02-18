import { Button } from "../ui/button";
import Image from "next/image";

export const SectionTwo = () => {
  return (
    <>
      {/* Section 2 */}
      <div className="flex flex-col mx-auto lg:flex-row bg-[#364e8a] px-4 md:px-16 py-16 xl:pr-32 gap-8 xl:gap-4">
        <div className="flex justify-center items-center flex-1">
          <div className="bg-white shadow-md rounded-[10px]">
            <Image
              src="/homepage-sectiontwo.webp"
              alt="would be changed later"
              width={900}
              height={800}
              className="object-contain aspect-[4/3] h-full w-full md:w-[540px] md:h-[320px] lg:w-[540px] lg:h-[400px] xl:w-[540px] xl:h-[320px] "
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-center items-center w-full gap-8 lg:pl-0 lg:py-16">
          <h1 className="text-[2rem] lg:text-[2.5rem] font-bold text-white text-center lg:text-left tracking-tighter leading-tight">
            {" "}
            {`Struggling to Get Your Answers Evaluated? `}{" "}
            <span className="text-red-500"> {`You're Not Alone`}</span>{" "}
          </h1>
          <div className="text-white text-center lg:text-left text-lg">
            {`With AnswerWriting, we’ve created an all-in-one AI-powered platform that doesn’t just assist—it assesses, analyzes, and enhances. By leveraging cutting-edge AI, we streamline the evaluation process, providing accurate and insightful feedback across your entire learning journey.`}
          </div>

          <div className="flex lg:flex-row flex-col lg:mr-auto gap-4">
            <Button size="lg">Start evaluating now</Button>
            <Button
              variant="transparent"
              className="text-white border-white hover:border-primary-dark"
              size="lg"
            >
              <i>Eliminate waiting time</i>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
