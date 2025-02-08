import { Exams, Subjects } from "answerwriting/types/ai.types";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import model from "answerwriting/llm";
import { prisma } from "answerwriting/prisma";

export const predictSubjectsPromptTemplate = `You are an expert in categorizing UPSC questions based on the official syllabus.  
Your task is to identify the most relevant subjects for the given question, ensuring that only directly related subjects are chosen.  
Guidelines for Selection:
1. Minimal & Precise Selection: Choose the fewest possible subjects that directly match the core theme of the question. Avoid selecting multiple subjects unless absolutely necessary.  
2. Contextual Understanding: Do not select a subject just because of keyword matches. Instead, focus on the question’s intent, scope, and thematic relevance to the syllabus.  
3. Primary Theme Focus: If a question involves multiple topics, prioritize the subject that best captures its main theme rather than picking multiple loosely related subjects.  
4. No Marginal Connections:Reject peripheral or weak associations. A subject should only be included if it is strongly relevant.  
   - Example: If a question discusses "urban development" but is primarily about "Indian architecture," select the most relevant subject, not loosely connected ones. 
5. Strict Syllabus Adherence: Only choose subjects that are explicitly covered in the provided UPSC syllabus. Do not infer subjects that are not listed.  
The question is: {question} 
The list of available subject with their syllabus (topics): {availableSubjectsWithSyllabus}
Provide your output in the following format: {output_format}
`;

export const predictSubjectsOutputFormat = z.object({
  subjectsRelatedToQuestion: z
    .array(z.nativeEnum(Subjects))
    .nonempty()
    .describe(
      "An array of the most relevant subjects directly related to the question.",
    ),

  reasonsWhySubjectsArePicked: z
    .record(
      z.nativeEnum(Subjects),
      z.string().describe("Provide a meaningful explanation for selection."),
    )
    .describe(
      "A mapping of selected subjects to their justification. Each subject should have a reason explaining its relevance to the question, based on the syllabus.",
    ),
});

async function predictSubject({
  exam,
  question,
}: {
  question: string;
  exam: Exams;
}): Promise<z.infer<typeof predictSubjectsOutputFormat>> {
  const prompt = ChatPromptTemplate.fromTemplate(predictSubjectsPromptTemplate);
  const opParser = StructuredOutputParser.fromZodSchema(
    predictSubjectsOutputFormat,
  );
  const chain = prompt.pipe(model).pipe(opParser);

  const subjects = await prisma.subject.findMany({
    where: { exam },
  });

  const response = await chain.invoke({
    question,
    availableSubjectsWithSyllabus: subjects.map((s) => ({
      subject: s.name,
      syllabus: s.topics.join,
    })),
    output_format: opParser.getFormatInstructions(),
  });

  return response;
}

export default predictSubject;
