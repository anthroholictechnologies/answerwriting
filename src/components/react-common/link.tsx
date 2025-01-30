import { cn } from "answerwriting/lib/utils";
import Link from "next/link";

const AnswerWritingLink = ({
  href,
  overrideClasses = "",
  linkText,
}: {
  href: string;
  overrideClasses?: string;
  linkText: string;
}) => {
  const baseClasses =
    "text-sm underline-offset-4 hover:underline text-primary-dark";

  const finalClasses = cn([baseClasses, overrideClasses]);
  return (
    <Link href={href} className={finalClasses}>
      {linkText}
    </Link>
  );
};

export default AnswerWritingLink;
