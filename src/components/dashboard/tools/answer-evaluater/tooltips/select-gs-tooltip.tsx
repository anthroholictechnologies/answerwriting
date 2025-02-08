import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "answerwriting/components/ui/tooltip";
import { Info } from "lucide-react";

export const SelectGSToolTip = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info className="w-4 h-4" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-sm p-4 bg-white text-black shadow-md">
        <p>
          <strong className="text-primary-dark">
            Select the correct GS Paper
          </strong>
        </p>
        <ul className="list-disc p-4 flex flex-col gap-2">
          <li>
            <strong>GS-1:</strong> History, Geography, Indian Society
          </li>
          <li>
            <strong>GS-2:</strong> Polity Constitution and Governance, Social
            Justice and IR
          </li>
          <li>
            <strong>GS-3:</strong> Economy, Environment Disaster and Management,
            Science & Tech and Agriculture
          </li>
          <li>
            <strong>GS-4:</strong> Ethics Integrity and Aptitude
          </li>
        </ul>
        <p className="mt-1 text-gray-600">
          {`Example: A question on "Fundamental Rights" belongs to `}
          <strong>GS-2</strong>.
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
