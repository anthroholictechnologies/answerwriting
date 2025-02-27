import { Button } from "answerwriting/components/ui/button";
import { cn } from "answerwriting/lib/utils";

export const ButtonTertiary = ({
  children,
  classes,
  onClick,
  disabled,
  size = "lg",
}: {
  children: React.ReactNode;
  classes?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: "lg" | "sm";
}) => {
  return (
    <Button
      size={size}
      className={cn("flex rounded-full text-md font-bold px-10", classes)}
      variant="transparent"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
