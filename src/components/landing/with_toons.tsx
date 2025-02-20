import Image from "next/image";

export const Section_4 = () => {
  return (
    <section className="flex flex-col items-center max-w-5xl mx-auto px-4 py-16 md:py-0 md:px-10 lg:px-16">
      {/** Section 1 */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 text-center md:text-left">
          <h2 className="font-bold text-2xl text-secondary-dark">
            Better Answers with Every Attempt
          </h2>
          <p className="text-lg text-secondary-dark">
            Refine your writing with each evaluation. Our AI-driven feedback
            helps you improve clarity, structure, and relevance—ensuring you get
            better with every try.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/homepage_sectionfour_one.webp"
            alt="Better Answers"
            width={400}
            height={400}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      </div>

      {/** Section 2 */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/homepage_sectionfour_two.webp"
            alt="Lightning-Fast Insights"
            width={400}
            height={400}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 text-center md:text-left">
          <h2 className="font-bold text-2xl text-secondary-dark">
            Lightning-Fast Insights, Meaningful Improvements
          </h2>
          <p className="text-lg text-secondary-dark">
            {` Say goodbye to waiting endlessly for feedback. AnswerWriting gives you instant, 
            AI-driven evaluation, helping you improve faster without compromising quality. 
            It’s like having a personal mentor, anytime you need.`}
          </p>
        </div>
      </div>

      {/** Section 3 */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 text-center md:text-left">
          <h2 className="font-bold text-2xl text-secondary-dark">
            Clear, Impactful Answers
          </h2>
          <p className="text-lg text-secondary-dark">
            Stop second-guessing your writing. With AI-driven evaluation, ensure
            every answer is well-structured, relevant, and effective. We refine
            your responses, highlight improvements, and help you write with
            confidence.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/homepage_sectionfour_three.webp"
            alt="Clear Answers"
            width={400}
            height={400}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};
