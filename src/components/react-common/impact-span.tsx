import { cn } from "answerwriting/lib/utils";

const ImpactSpan = ({
  text,
  overrideClasses,
}: {
  text: string;
  overrideClasses?: string;
}) => {
  const baseClasses = "text-primary-dark font-bold";
  const finalClasses = cn(baseClasses, overrideClasses);
  return <span className={finalClasses}> {text} </span>;
};

export default ImpactSpan;
