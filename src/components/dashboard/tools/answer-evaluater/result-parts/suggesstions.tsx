"use client";
import { EvaluateAnswerAPIResponse } from "answerwriting/validations/ai.schema";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { JSX, useState } from "react";

export const HighlightedText = ({ text }: { text: string }) => {
  const highlightText = (input: string) => {
    return input.split("\n\n").map((para, paraIndex) => {
      const sentences = para
        .split(/([.?!])\s+/)
        .reduce((acc, part, index, arr) => {
          if (index % 2 === 0) {
            const sentence = part + (arr[index + 1] || ""); // Attach punctuation if available

            const highlightedSentence = sentence
              .replace(
                /\b(e\.g\.|i\.e\.|etc\.)\b/g,
                '<span class="text-primary-dark font-bold">$1</span>',
              ) // Highlight e.g., i.e., etc.
              .replace(
                /\(([^)]+)\)/g,
                '<span class="text-primary-dark font-semibold">($1)</span>',
              ) // Highlight ( )
              .replace(
                /\b(\d{4})\b/g,
                '<span class="text-blue-500 font-semibold">$1</span>',
              ); // Highlight years like 2024

            acc.push(
              <p
                key={`${paraIndex}-${index}`}
                className="leading-relaxed text-tertirary font-medium text-sm"
                dangerouslySetInnerHTML={{ __html: highlightedSentence }}
              />,
            );
          }
          return acc;
        }, [] as JSX.Element[]);

      return (
        <div key={paraIndex} className="space-y-4 p-4">
          {sentences}
        </div>
      );
    });
  };

  return <div className="space-y-4">{highlightText(text)}</div>;
};

export const Suggessions = ({
  evaluationResults,
}: {
  evaluationResults: EvaluateAnswerAPIResponse;
}) => {
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);
  if (!evaluationResults.overall_feedback.suggestions.length) {
    return null;
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-medium text-tertiary">
        <MessageSquare className="h-5 w-5" />
        Improvement Suggestions
      </div>
      <div className="space-y-4">
        {evaluationResults.overall_feedback.suggestions.map(
          (suggestion, index) => (
            <div
              key={index}
              className="border-l-4 border-primary-dark bg-accent hover:bg-accent/40 transition-colors duration-200"
            >
              <button
                onClick={() =>
                  setActiveSuggestion(activeSuggestion === index ? null : index)
                }
                className="w-full text-left px-6 py-4 flex justify-between items-center"
              >
                <span className="font-medium text-tertiary">
                  {suggestion.suggestion}
                </span>
                {activeSuggestion === index ? (
                  <ChevronUp className="h-8 w-8 text-tertiary" />
                ) : (
                  <ChevronDown className="h-8 w-8 text-tertiary" />
                )}
              </button>
              {activeSuggestion === index && (
                <div className="px-6 pb-4">
                  <div className="bg-white p-4 rounded-lg leading-6">
                    <HighlightedText text={suggestion.example} />
                  </div>
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
};
