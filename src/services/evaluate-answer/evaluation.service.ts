import { HumanMessage } from "@langchain/core/messages";
import model from "answerwriting/llm";

async function evaluate({
  question,
  images,
  evaluation_parameters,
  answer_word_limit,
  output_format,
}: {
  question: string;
  images: string[];
  evaluation_parameters: {
    parameter: string;
    logic: string[];
  }[];
  answer_word_limit: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output_format: any;
}) {
  const prompt = `
You are a strict UPSC exam teacher who is an expert in evaluating the answers of UPSC Mains exam.
You are provided with the answer in the images. The order of the images matters; the answer is in continuation.
You are also provided with a question, answer word limit, and the detailed evaluation parameters with logic.
Instructions to Calculate the Score of the Answer:
1. You are given a list of evaluation parameters in the format [{parameter: "", logic: [""], category: ""}].
2. Assess the answer against each parameter and provide a score out of 10 for every parameter.
3. Ensure that each parameter is included in the output, even if the answer does not satisfy it.
4. If an answer lacks elements required by a parameter, give a low score and clearly state why.
5. Only provide suggestions for improvement based on subject-specific parameters. 
   - Do not provide any suggestions based on base parameters.
   - If a base parameter is not satisfied, simply assign a score and state the reason, but do not offer suggestions.
Question:  
${question}
Answer Word Limit:  
${answer_word_limit}
Evaluation Parameters:  
${JSON.stringify(evaluation_parameters, null, 2)}
Output Format (Strictly Follow This):  
${output_format}
`;

  const message = new HumanMessage({
    content: [
      ...images.map((img) => ({ type: "image_url", image_url: img })),
      {
        type: "text",
        text: prompt,
      },
    ],
  });

  const response = await model.invoke([message]);
  return JSON.parse(
    (response.content as string).replace(/```json|```/g, "").trim(),
  );
}

export default evaluate;
