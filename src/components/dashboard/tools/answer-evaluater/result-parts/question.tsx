import { getWordsFromMarks } from "answerwriting/lib/utils";
import { Exams, Marks } from "answerwriting/types/ai.types";

export const Question = ({
  exam,
  marks,
  question,
}: {
  exam: Exams;
  marks: Marks;
  question: string;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-primary-dark text-white rounded-full text-sm font-medium">
          {exam}
        </span>
        <span className="px-3 py-1 bg-tertiary text-white rounded-full text-sm font-medium">
          {marks} Marks
        </span>
        <span className="px-3 py-1  bg-primary-dark text-white rounded-full text-sm font-medium">
          {getWordsFromMarks(marks)} words
        </span>
      </div>
      <h1 className="text-xl font-semibold text-primary-dark">{question}</h1>
    </div>
  );
};
