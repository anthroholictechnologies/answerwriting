import { CheckCircle } from "lucide-react";
import React, { useMemo } from "react";

type ScoreLevel = "bad" | "good" | "excellent" | "great";

interface ScoreDisplayProps {
  scoredMarks: number;
  totalMarks: number;
  summary: string;
}

const ScoreDisplay = ({
  scoredMarks,
  totalMarks,
  summary,
}: ScoreDisplayProps) => {
  const percentage = useMemo(
    () => (scoredMarks / totalMarks) * 100,
    [scoredMarks, totalMarks],
  );

  const getScoreLevel = (percent: number): ScoreLevel => {
    if (percent <= 20) return "bad";
    if (percent <= 40) return "good";
    if (percent <= 60) return "excellent";
    return "great";
  };

  const scoreConfigs = {
    bad: {
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    good: {
      color: "text-yellow-900",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    excellent: {
      color: "text-blue-900",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    great: {
      color: "text-green-900",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  };

  const level = getScoreLevel(percentage);
  const config = scoreConfigs[level];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-medium text-tertiary">
        <CheckCircle className="h-5 w-5" />
        Your Score
      </div>
      <div
        className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4`}
      >
        <div className="flex flex-col gap-2">
          {/* Score Circle */}
          <div className="text-2xl font-bold">
            <span className="text-tertiary">{scoredMarks ?? 0}</span>
            <span className="text-tertiary ">/</span>
            <span className="text-tertiary ">{totalMarks}</span>
          </div>
        </div>
        {summary}
      </div>
    </div>
  );
};

export default ScoreDisplay;
