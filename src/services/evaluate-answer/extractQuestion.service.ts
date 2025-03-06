import { HumanMessage } from "@langchain/core/messages";
import model from "answerwriting/llm";
import { DetectQuestion } from "answerwriting/validations/ai.schema";

async function detectQuestion({
  image,
  output_format,
}: {
  image: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output_format: any;
}): Promise<DetectQuestion> {
  const prompt = `
You are an expert assistant capable of performing general-purpose tasks efficiently.
You will be provided with an image containing both a question and an answer.
Your task is to accurately extract the question from the image and provide it word for word without any modifications.
If no question is found in the image, return an empty string instead of generating a question on your own.
Output Format (Strictly Follow This):  

${output_format}
`;

  const message = new HumanMessage({
    content: [
      { type: "image_url", image_url: image },
      {
        type: "text",
        text: prompt,
      },
    ],
  });

  const response = await model.invoke([message]);
  return JSON.parse(
    (response.content as string).replace(/```json|```/g, "").trim()
  );
}

export default detectQuestion;
