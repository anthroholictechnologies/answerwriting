import { SecondarySection } from "answerwriting/components/react-common/sections/secondary_section";
import { ButtonSecondary } from "../react-common/buttons/button_secondary";
import { ButtonPrimary } from "../react-common/buttons/button_primary";

export const Section_2 = () => {
  return (
    <SecondarySection
      title="Struggling to Get Your Answers Evaluated?"
      highlightedText="You're Not Alone"
      description="With AnswerWriting, we’ve created an all-in-one AI-powered platform
        that doesn’t just assist—it assesses, analyzes, and enhances. By
        leveraging cutting-edge AI, we streamline the evaluation process,
        providing accurate and insightful feedback across your entire learning journey."
      imageSrc="/homepage-sectiontwo.webp"
      ctaButtons={
        <>
          <ButtonPrimary>🚀 Start evaluating now</ButtonPrimary>
          <ButtonSecondary>🚀 Eliminate waiting time</ButtonSecondary>
        </>
      }
    />
  );
};

export const Section_5 = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <SecondarySection
      title="Precise Feedback for"
      highlightedText="Better Answers"
      description="Write. Evaluate. Improve. AnswerWriting helps you master the art of 
        answer writing by providing instant, AI-driven feedback. Whether you aim 
        to refine your structure, enhance clarity, or meet UPSC standards, our 
        platform guides you at every step."
      imageSrc="/homepage_sectionfive.webp"
      ctaButtons={
        <>
          {isLoggedIn ? (
            <ButtonSecondary>💎 Upgrade to Pro</ButtonSecondary>
          ) : (
            <ButtonSecondary>{`✍🏻 Sign up now. It's free`}</ButtonSecondary>
          )}
        </>
      }
      reverseLayout // Flip layout for variation
    />
  );
};
