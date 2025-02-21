import { Button } from "answerwriting/components/ui/button";
import { cn } from "answerwriting/lib/utils";

export const ButtonTertiary = ({
  children,
  classes,
}: {
  children: React.ReactNode;
  classes?: string;
}) => {
  return (
    <Button
      className={cn("flex rounded-full text-md font-bold px-10", classes)}
      variant="transparent"
    >
      {children}
    </Button>
  );
};
