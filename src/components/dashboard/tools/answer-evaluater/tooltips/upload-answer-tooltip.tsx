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
  MAX_PDF_NUM_PAGES,
  SINGLE_IMAGE_UPLOAD_SIZE_BYTES,
} from "answerwriting/config";
import { Info } from "lucide-react";

export const UploadAnswerToolTip = () => {
  return (
    <>
      {/* Tooltip for larger screens */}
      <div className="hidden lg:block">
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
      <div className="lg:hidden">
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
        If you are uploading the images then ensure that you are uploading in
        them correct <strong>order</strong>
      </li>
      <li>
        The question must be written on the <strong> first page </strong> of the
        PDF or the question must be written in the{" "}
        <strong> first uploaded image</strong>
      </li>
      <li>
        Maximum PDF size:{" "}
        <strong> {MAX_PDF_UPLOAD_SIZE_BYTES / 1024 / 1024} MB </strong>
      </li>
      <li>
        Maximum PDF page limit: <strong> {MAX_PDF_NUM_PAGES} pages </strong>
      </li>
      <li>
        Maximum image size:{" "}
        <strong> {SINGLE_IMAGE_UPLOAD_SIZE_BYTES / 1024 / 1024} MB </strong>
      </li>
      <li>
        Number of images allowed: <strong> {MAX_IMAGES_ALLOWED} images </strong>
      </li>
    </ul>
  </>
);
