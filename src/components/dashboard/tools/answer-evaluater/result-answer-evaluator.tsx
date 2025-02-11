import React from "react";
import { EvaluateAnswerAPIResponse } from "answerwriting/validations/ai.schema";
import { AnswerEvaluatorLoader } from "./result-parts/loader-answer-evaluator";
import { NoResults } from "./result-parts/no-results-answer-evaluator";
import { Question } from "./result-parts/question";
import { Suggessions } from "./result-parts/suggesstions";
import { ExcellenceParams } from "./result-parts/excellence-params";
import { ImprovedAnswer } from "./result-parts/improved-answer";
import Score from "./result-parts/score";

export const AnswerEvaluatorResult = ({
  evaluationResults,
  loading,
}: {
  evaluationResults?: EvaluateAnswerAPIResponse | null;
  loading?: boolean;
}) => {
  if (loading) {
    return <AnswerEvaluatorLoader />;
  }

  if (!evaluationResults) {
    return <NoResults />;
  }

  return (
    <div className="space-y-6">
      <Question
        exam={evaluationResults.exam}
        marks={evaluationResults.marks}
        question={evaluationResults.question}
      />
      <Score
        scoredMarks={evaluationResults.marksScored}
        totalMarks={Number(evaluationResults.marks)}
        summary={evaluationResults.summary}
      />
      <Suggessions evaluationResults={evaluationResults} />
      <ExcellenceParams evaluationResults={evaluationResults} />
      <ImprovedAnswer answer={evaluationResults.improved_answer} />
    </div>
  );
};

export default AnswerEvaluatorResult;
