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
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import { SINGLE_IMAGE_UPLOAD_SIZE_BYTES } from "answerwriting/config";

export const SkipQuestionUploadToolTip = () => {
  return (
    <>
      {/* Tooltip for larger screens */}
      <div className="hidden lg:block">
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-sm bg-white text-black flex flex-col p-4 gap-2 shadow-md">
            <SkipQuestionGuidelines />
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Popover for smaller screens */}
      <div className="lg:hidden">
        <Popover>
          <PopoverTrigger>
            <Info className="h-4 w-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="max-w-xs text-sm bg-white text-black flex flex-col p-4 gap-2 shadow-md">
            <SkipQuestionGuidelines />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
// Extract guidelines into a separate component for reusability
const SkipQuestionGuidelines = () => (
  <ul className="flex flex-col gap-4">
    <ImpactSpan text="Skip question guidelines" />
    <li>
      {" "}
      If you are uploading <strong>answer PDF</strong> your question must be on
      the <strong> top of the first page of the answer PDF</strong>. Make sure
      that there is a <strong> clear seperation</strong> between the answer and
      question
    </li>

    <li>
      {" "}
      If you are uploading <strong> answer images </strong>your question must be
      on <strong> the top of the first image that you upload </strong>. Make
      sure that there is a <strong> clear seperation </strong>
      between the answer and question
    </li>
  </ul>
);

export const UploadQuestionToolTip = () => {
  return (
    <>
      {/* Tooltip for larger screens */}
      <div className="hidden lg:block">
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-sm bg-white text-black flex flex-col p-4 gap-2 shadow-md">
            <UploadQuestionGuideLines />
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Popover for smaller screens */}
      <div className="lg:hidden">
        <Popover>
          <PopoverTrigger>
            <Info className="h-4 w-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="max-w-xs text-sm bg-white text-black flex flex-col p-4 gap-2 shadow-md">
            <UploadQuestionGuideLines />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
// Extract guidelines into a separate component for reusability
const UploadQuestionGuideLines = () => (
  <>
    <ImpactSpan text="Upload question image guideliness" />
    <p>
      Upload a clear, image displaying only a <strong>single question,</strong>
      properly <strong> cropped </strong>to remove unnecessary details.The image{" "}
      <strong>should not include any answers.</strong>
      <br />
      <br />
      Maximum image size:{" "}
      <strong> {SINGLE_IMAGE_UPLOAD_SIZE_BYTES / 1024 / 1024} MB </strong>
    </p>
  </>
);
