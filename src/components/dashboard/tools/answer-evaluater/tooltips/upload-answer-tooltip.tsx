import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "answerwriting/components/ui/tooltip";
import {
  MAX_IMAGES_ALLOWED,
  MAX_PDF_UPLOAD_SIZE_BYTES,
} from "answerwriting/config";
import { Info } from "lucide-react";

export const UploadAnswerToolTip = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info className="h-4 w-4" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-sm bg-white text-black flex flex-col p-4 gap-2 shadow-md">
        <p>
          <strong className="text-primary-dark">Upload Guidelines</strong>
        </p>
        <ul className="list-disc pl-4 flex flex-col gap-2">
          <li>
            Either a single <strong>PDF</strong> or{" "}
            <strong> one or more than one image </strong> is allowed.
          </li>
          <li>
            Maximum file size is for pdf is{" "}
            <strong> {MAX_PDF_UPLOAD_SIZE_BYTES / 1024 / 1024} MB </strong>
          </li>
          <li>
            Maximum file size for each image is{" "}
            <strong> {MAX_PDF_UPLOAD_SIZE_BYTES / 1024 / 1024} MB </strong>, max{" "}
            {MAX_IMAGES_ALLOWED} are allowed.
          </li>
          <li>
            {" "}
            Upload a <strong>single</strong> pdf or upload{" "}
            <strong>multiple </strong> images in <strong> correct </strong>{" "}
            order. Order of images matter to preserve the continuity of the
            answer.
          </li>
        </ul>
      </TooltipContent>
    </Tooltip>
  );
};
