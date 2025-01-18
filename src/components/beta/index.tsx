"use client";
import { useState } from "react";
import PromptForm from "./PromptForm";
import ResultsChat from "./ResultsChat";
import { EvaluationResponse } from "answerwriting/types";

export const BetaAnswerChecking = () => {
  const [results, setResults] = useState<unknown>();
  const [loading, setLoading] = useState(false); // Initialize as false explicitly

  const handleSubmit = async (formData: {
    question: string;
    images: File[];
  }) => {
    try {
      const formDataObj = new FormData();
      formDataObj.append("question", formData.question);
      formData.images.forEach((image) => {
        formDataObj.append(`images`, image);
      });

      setLoading(true);
      const resp = await fetch(`/api/evaluate`, {
        method: "POST",
        body: formDataObj,
      });

      if (!resp.ok) {
        throw new Error("Failed to submit the form");
      }

      const data = await resp.json();
      console.log("data=========", data);
      setResults(data.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally show an error message to the user here
    } finally {
      setLoading(false); // Always set loading to false, whether the request succeeds or fails
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/2">
        <PromptForm onSubmit={handleSubmit} loading={loading} />{" "}
        {/* Pass loading to PromptForm too */}
      </div>
      <div className="w-full md:w-1/2">
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="w-full max-w-[80%] space-y-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-full w-24"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
              </div>
              LOADING....
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-full w-32"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-5/6"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-2/3"></div>
              </div>
            </div>
          </div>
        ) : (
          <ResultsChat
            initialResponse={results as EvaluationResponse}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};
