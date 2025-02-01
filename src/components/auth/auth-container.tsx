import { cn } from "answerwriting/lib/utils";

const AuthContainer = ({
  children,
  classNames,
}: {
  children: React.ReactNode;
  classNames?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:p-16 lg:shadow-[darkBlue] lg:border rounded-standard bg-white",
        classNames,
      )}
    >
      {children}
    </div>
  );
};

//flex flex-col gap-4 lg:shadow-xl lg:p-8 lg:px-16 bg-white
export default AuthContainer;
