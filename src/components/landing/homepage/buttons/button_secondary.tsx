import { Button } from "answerwriting/components/ui/button";

export const ButtonSecondary = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Button
      variant="secondary"
      className="flex rounded-full text-md font-bold"
      size={"lg"}
    >
      {children}
    </Button>
  );
};
