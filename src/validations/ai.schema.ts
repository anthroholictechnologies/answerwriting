import { Exams, Marks } from "answerwriting/types/ai.types";
import { z } from "zod";

export const evaluateAnswerSchema = z.object({
  question: z.string({ message: "Please enter a valid question." }),
  exam: z.nativeEnum(Exams, {
    message: `Please select an exam from the following values: ${Object.values(Exams).join(", ")}.`,
  }),
  marks: z.nativeEnum(Marks, {
    message: `Please select marks from the following values: ${Object.values(Marks).join(", ")}.`,
  }),
});

export type EvaluateAnswerInput = z.infer<typeof evaluateAnswerSchema>;

export const evaluationSchema = z.object({
  current_relevance: z.object({
    present: z.boolean().describe(
      `Indicates whether the answer effectively integrates current affairs: 
      - Application of recent events, data, or policies to enrich the response.
      - Awareness of contemporary debates or developments. 
      If present, set to true; otherwise, false.`,
    ),
    justification: z
      .string()
      .describe(
        `If current relavence is present then justify how it is present in the answer`,
      ),
  }),
  visual_aid: z.object({
    present: z.boolean().describe(
      `Indicates whether visual aids are used effectively:  
      - Inclusion of diagrams, flowcharts, or tables where appropriate.
      - Enhances clarity and understanding of the answer. 
      If present, set to true; otherwise, false.`,
    ),
    justification: z
      .string()
      .describe(
        `If visual aid is present then justify how it is present in the answer`,
      ),
  }),
  parameter_scores: z
    .array(
      z.object({
        parameter: z
          .string()
          .describe(
            "The name of the evaluation parameter being assessed. Examples: 'Understanding & Interpretation', 'Content Quality', 'Language & Expression', 'Structure & Organization'. This provides context for the specific aspect of the answer being scored.",
          ),
        score: z
          .number()
          .min(0)
          .max(10)
          .describe(
            "The actual score awarded for this parameter based on the evaluation. This score should reflect how well the student's answer met the expectations of the parameter.",
          ),
        justification: z
          .string()
          .describe(
            "A detailed, specific, and constructive explanation for the score assigned to this parameter.",
          ),
      }),
    )
    .describe(
      "An array containing evaluation scores for each parameter. Each item in this array corresponds to a parameter being evaluated, along with the score awarded, the maximum possible score, and a justification for the result.",
    ),
  overall_feedback: z
    .object({
      suggestions: z
        .array(
          z.object({
            suggestion: z
              .string()
              .describe(
                "An actionable suggestion for improving the answer. This should provide a specific detail about how the student can address the weakness or improve their answer.",
              ),
            example: z
              .string()
              .describe(
                "A concrete implementation of the suggestion, including relevant details and examples. For instance, if the suggestion involves strengthening critical thinking by incorporating multiple perspectives, the example should specifically analyze real-world cases, their outcomes, and how they apply to the context of the answer. Avoid generic statements and ensure the example demonstrates how to improve the answer directly.",
              ),
          }),
        )
        .describe(
          "A list of actionable suggestions for every parameter the answer fails to meet, along with concrete examples implementing those suggestions. Examples must directly demonstrate how to apply the suggestion to the answer, providing clarity and practical insight.",
        ),
    })
    .describe(
      "Overall feedback about the student's answer, including a summary and actionable suggestions with implemented examples.",
    ),
  improved_answer: z
    .string()
    .nonempty()
    .describe(
      "The improved answer should include embedded inline notes explaining the changes made at specific points in the text. These notes should provide clarity on why the change was made and how it improves the response. Also improved answer should adhere the word limit.",
    ),
});

export type Evaluation = z.infer<typeof evaluationSchema>;
