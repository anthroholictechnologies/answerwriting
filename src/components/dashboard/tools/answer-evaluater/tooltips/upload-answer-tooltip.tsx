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
import {
  MAX_IMAGES_ALLOWED,
  MAX_PDF_UPLOAD_SIZE_BYTES,
} from "answerwriting/config";
import { Info } from "lucide-react";

export const UploadAnswerToolTip = () => {
  return (
    <>
      {/* Tooltip for larger screens */}
      <div className="hidden sm:block">
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-sm bg-white text-black flex flex-col p-4 gap-2 shadow-md">
            <UploadGuidelines />
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Popover for smaller screens */}
      <div className="sm:hidden">
        <Popover>
          <PopoverTrigger>
            <Info className="h-4 w-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="max-w-xs text-sm bg-white text-black flex flex-col p-4 gap-2 shadow-md">
            <UploadGuidelines />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

// Extract guidelines into a separate component for reusability
const UploadGuidelines = () => (
  <>
    <p>
      <strong className="text-primary-dark">Upload Guidelines</strong>
    </p>
    <ul className="list-disc pl-4 flex flex-col gap-2">
      <li>
        Either a single <strong>PDF</strong> or{" "}
        <strong> one or more images </strong> is allowed.
      </li>
      <li>
        Maximum PDF size:{" "}
        <strong> {MAX_PDF_UPLOAD_SIZE_BYTES / 1024 / 1024} MB </strong>
      </li>
      <li>
        Maximum image size:{" "}
        <strong> {MAX_PDF_UPLOAD_SIZE_BYTES / 1024 / 1024} MB </strong>, up to{" "}
        {MAX_IMAGES_ALLOWED} images.
      </li>
      <li>
        Upload a <strong>single</strong> PDF or <strong>multiple</strong> images
        in <strong>correct</strong> order.
      </li>
    </ul>
  </>
);
