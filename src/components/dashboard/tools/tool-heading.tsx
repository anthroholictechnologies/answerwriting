import { cn } from "answerwriting/lib/utils";
import Image from "next/image";
const ToolHeading = ({
  heading,
  className,
}: {
  heading: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col md:mt-8 lg:mt-0 lg:flex-row justify-center h-32 items-center gap-1",
        className ?? "",
      )}
    >
      <Image
        src="/logo_2.svg"
        height={100}
        width={100}
        alt="answerwriting logo"
        className="w-16 h-16"
      />
      <h1 className="text-primary-dark font-semibold text-3xl tracking-tighter leading-none">
        {heading}
      </h1>
    </div>
  );
};

export default ToolHeading;
