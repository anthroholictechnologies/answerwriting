import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "answerwriting/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "answerwriting/components/ui/popover";
import { Info } from "lucide-react";

export const PricingToolTip = ({ text }: { text: string }) => {
  return (
    <TooltipProvider>
      {" "}
      {/* ✅ Wrap Tooltips in TooltipProvider */}
      {/* Tooltip for larger screens */}
      <div className="hidden lg:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-4 h-4 cursor-pointer text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-white text-black text-sm p-4 shadow-lg border border-border">
            <p>{text}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {/* Popover for smaller screens */}
      <div className="lg:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Info className="w-4 h-4 cursor-pointer text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent className="max-w-xs text-sm p-4 shadow-md border border-border">
            <p>{text}</p>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
};
