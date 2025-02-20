import { Button } from "answerwriting/components/ui/button";

export const ButtonTertiary = ({ children }: { children: React.ReactNode }) => {
  return (
    <Button
      className="flex rounded-full text-md font-bold px-10"
      variant="transparent"
    >
      {children}
    </Button>
  );
};
