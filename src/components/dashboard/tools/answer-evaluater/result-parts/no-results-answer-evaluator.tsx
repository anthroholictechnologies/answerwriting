import { ClipboardCheck } from "lucide-react";

export const NoResults = () => {
  return (
    <div className="p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 text-center space-y-4">
          <div className="rounded-full bg-blue-50 p-3 sm:p-4">
            <ClipboardCheck className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              No Evaluation Results Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-sm px-4 sm:px-0">
              Submit your answer to receive detailed feedback and evaluation
              results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
