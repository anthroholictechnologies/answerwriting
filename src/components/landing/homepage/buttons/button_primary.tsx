import { Button } from "answerwriting/components/ui/button";

export const ButtonPrimary = ({ children }: { children: React.ReactNode }) => {
  return (
    <Button size="lg" className="flex rounded-full text-md font-bold">
      {children}
    </Button>
  );
};
