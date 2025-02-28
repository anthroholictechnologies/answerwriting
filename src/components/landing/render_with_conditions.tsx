import { TertiarySection } from "answerwriting/components/react-common/sections/tertiary_section";
import { UserDetailProp } from "answerwriting/types/general.types";

export const Section_3 = ({ userDetails }: { userDetails: UserDetailProp }) => {
  return (
    <TertiarySection
      title="Go Pro Score more with"
      highlightText="AnswerWriting"
      description="Upgrade to advanced answer evaluation, deep insights, and unlimited practice."
      userDetails={userDetails}
    />
  );
};

export const Section_7 = ({ userDetails }: { userDetails: UserDetailProp }) => {
  return (
    <TertiarySection
      title="Write Confidently, Score Higher with"
      highlightText="AnswerWriting"
      description="Refine your UPSC Mains answers with precision. Our AI-driven evaluation ensures clarity, relevance, and structured writing—helping you improve with every attempt. Master the art of answer writing and boost your scores with actionable feedback."
      userDetails={userDetails}
      gradientBackground
    />
  );
};
