import { EvaluateAnswerAPIResponse } from "answerwriting/validations/ai.schema";
import { AlertCircle, CheckCircle2, Image, Newspaper } from "lucide-react";

export const ExcellenceParams = ({
  evaluationResults,
}: {
  evaluationResults: EvaluateAnswerAPIResponse;
}) => {
  if (
    !evaluationResults.current_relevance.present &&
    !evaluationResults.visual_aid.present
  ) {
    return null;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-tertiary">
          <Newspaper className="h-5 w-5" />
          <span className="font-medium">Current Relevance</span>
        </div>
        <div className="flex items-start gap-3 bg-accent p-4 rounded-lg">
          {evaluationResults.current_relevance.present ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <AlertCircle className="h-8 w-8 text-yellow-500 mt-0.5" />
          )}
          <p className="text-sm text-tertiary">
            {evaluationResults.current_relevance.justification}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-tertiary">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image className="h-5 w-5" />
          <span className="font-medium">Visual Aid Usage</span>
        </div>
        <div className="flex items-start gap-3 bg-accent p-4 rounded-lg">
          {evaluationResults.visual_aid.present ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          )}
          <p className="text-sm text-tertiary">
            {evaluationResults.visual_aid.justification}
          </p>
        </div>
      </div>
    </div>
  );
};
