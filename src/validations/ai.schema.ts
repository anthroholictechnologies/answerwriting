import { Exams, Marks } from "answerwriting/types/ai.types";
import { z } from "zod";

export const evaluateAnswerSchema = z.object({
  question: z
    .string({ message: "Please enter a valid question." })
    .min(10, { message: "Please enter a valid question" }),
  exam: z.nativeEnum(Exams, {
    message: `Please select an exam from the following values: ${Object.values(Exams).join(", ")}.`,
  }),
  marks: z.nativeEnum(Marks, {
    message: `Please select marks from the following values: ${Object.values(Marks).join(", ")}.`,
  }),
});

export type EvaluateAnswerInput = z.infer<typeof evaluateAnswerSchema>;

export const evaluationSchema = z.object({
  summary: z.string().describe(
    `Summary of the evaluation feedback on the answer. 
       - Please do not expose any internal marking scheme or parameters`,
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
                "A concrete implementation of the suggestion, including relevant details and examples. Avoid generic statements and ensure the example demonstrates how to improve the answer directly.",
              ),
          }),
        )
        .describe(
          "A list of actionable suggestions for every subject-specific parameter the answer fails to meet. Base parameters should not have suggestions.",
        ),
    })
    .describe(
      "Overall feedback about the student's answer, based only on subject-specific parameters. No base parameters should influence this feedback.",
    ),
  improved_answer: z
    .string()
    .nonempty()
    .describe(
      "The improved answer should incorporate only subject-specific parameters and exclude base parameter considerations. Embedded inline notes should explain the changes made and how they improve the response. The improved answer must adhere to the word limit.",
    ),
  parameter_scores: z
    .array(
      z.object({
        parameter: z
          .string()
          .describe(
            "The name of the evaluation parameter being assessed. Examples: 'Understanding & Interpretation', 'Content Quality', 'Language & Expression', 'Structure & Organization'. This provides context for the specific aspect of the answer being scored.",
          ),
        category: z
          .enum(["base_parameter", "subject_specific_parameter"])
          .describe(
            "The category of the parameter. If 'base_parameter', it should only have a score and justification. If 'subject_specific_parameter', it can have suggestions and contribute to the improved answer.",
          ),
        score: z
          .number()
          .min(0)
          .max(10)
          .describe(
            "The actual score awarded for this parameter based on the evaluation. This score should reflect how well the student's answer met the expectations of the parameter.",
          ),
        // justification: z
        //   .string()
        //   .describe(
        //     "A detailed, specific, and constructive explanation for the score assigned to this parameter."
        //   ),
      }),
    )
    .describe(
      "An array containing evaluation scores for each parameter. Each item in this array corresponds to a parameter being evaluated, along with the score awarded, the maximum possible score.",
    ),
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
        `If current relevance is present then justify how it is present in the answer.`,
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
        `If visual aid is present then justify how it is present in the answer.`,
      ),
  }),
});

export type Evaluation = z.infer<typeof evaluationSchema>;

export type EvaluateAnswerAPIResponse = Omit<Evaluation, "parameter_scores"> & {
  question: string;
  marks: Marks;
  exam: Exams;
  marksScored: number;
};
