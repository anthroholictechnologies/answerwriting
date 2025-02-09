import { cn } from "answerwriting/lib/utils";

const Spinner = ({ classNames }: { classNames?: string }) => {
  const baseClasses =
    "w-12 h-12 border-4 border-primary-dark rounded-full animate-spin border-t-tertiary dark:border-t-tertiary";
  const finalClasses = cn(baseClasses, classNames);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className={finalClasses} />
    </div>
  );
};

export default Spinner;
