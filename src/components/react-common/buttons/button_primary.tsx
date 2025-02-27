import { Button } from "answerwriting/components/ui/button";
import { cn } from "answerwriting/lib/utils";

export const ButtonPrimary = ({
  children,
  size,
  styles,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  styles?: string;
  size?: "lg" | "sm" | "default" | "icon" | null | undefined;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <Button
      size={size ?? "lg"}
      className={cn("flex rounded-full text-md font-bold", styles ?? "")}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
