import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "answerwriting/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "answerwriting/components/ui/popover";
import { Info } from "lucide-react";

export const SelectGSToolTip = () => {
  return (
    <>
      {/* Tooltip for larger screens */}
      <div className="hidden sm:block">
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-sm p-4 bg-white text-black shadow-md">
            <GSGuidelines />
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Popover for smaller screens */}
      <div className="sm:hidden">
        <Popover>
          <PopoverTrigger>
            <Info className="w-4 h-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="max-w-xs text-sm p-4 bg-white text-black shadow-md">
            <GSGuidelines />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

// Extracted component for clarity
const GSGuidelines = () => (
  <>
    <p>
      <strong className="text-primary-dark">Select the correct GS Paper</strong>
    </p>
    <ul className="list-disc p-4 flex flex-col gap-2">
      <li>
        <strong>GS-1:</strong> History, Geography, Indian Society
      </li>
      <li>
        <strong>GS-2:</strong> Polity, Constitution & Governance, Social
        Justice, IR
      </li>
      <li>
        <strong>GS-3:</strong> Economy, Environment, Disaster Management,
        Science & Tech, Agriculture
      </li>
      <li>
        <strong>GS-4:</strong> Ethics, Integrity, and Aptitude
      </li>
    </ul>
    <p className="mt-1 text-gray-600">
      Example: A question on <strong>{`"Fundamental Rights"`}</strong> belongs
      to <strong>GS-2</strong>.
    </p>
  </>
);
