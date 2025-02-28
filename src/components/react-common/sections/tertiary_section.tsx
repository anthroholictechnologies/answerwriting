import ImpactSpan from "answerwriting/components/react-common/impact-span";
import { CommonButton } from "../buttons/button_upgrade";
import { UserDetailProp } from "answerwriting/types/general.types";

interface TertiarySectionProps {
  title: string;
  highlightText: string;
  description: string;
  userDetails: UserDetailProp;
  gradientBackground?: boolean;
}

export const TertiarySection = ({
  title,
  highlightText,
  description,
  userDetails,
  gradientBackground = false,
}: TertiarySectionProps) => {
  return (
    <section
      className={`flex flex-col items-center text-center gap-6 px-6 md:px-10 lg:px-20 pt-16 md:py-16 lg:py-20 ${
        gradientBackground ? "bg-gradient-to-b from-[#fbfeff] to-[#ecf8ff]" : ""
      }`}
    >
      <h2 className="text-2xl max-w-4xl lg:text-4xl font-bold tracking-tight leading-tight">
        {title}{" "}
        <span className="relative inline-block">
          <ImpactSpan text={highlightText} />
          <svg
            className="absolute -bottom-1 left-0 w-full"
            height="12"
            viewBox="0 0 200 12"
          >
            <path
              d="M2 8.5C50 2.5 150 2.5 198 8.5"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </span>
      </h2>
      <p className="text-lg max-w-4xl lg:text-xl">{description}</p>
      <CommonButton userDetails={userDetails} variant="primary" />
    </section>
  );
};
