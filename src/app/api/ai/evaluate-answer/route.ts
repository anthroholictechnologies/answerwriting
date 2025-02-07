import { getWordsFromMarks } from "answerwriting/lib/utils";
import { prisma } from "answerwriting/prisma";
import evaluate from "answerwriting/services/evaluate-answer/evaluation.service";
import predictSubject from "answerwriting/services/evaluate-answer/predictSubjects.service";
import { Exams, Marks } from "answerwriting/types/ai.types";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";
import {
  Evaluation,
  evaluationSchema,
} from "answerwriting/validations/ai.schema";
import { StructuredOutputParser } from "langchain/output_parsers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Converts a file to a base64 string.
 * @param file - The file to be converted.
 * @returns A promise that resolves to a base64-encoded string.
 */
async function convertFileToBase64(file: Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");
  return `data:${file.type};base64,${base64String}`;
}

/**
 * Handles the evaluation request by processing the uploaded answer images and question details.
 * @param request - The Next.js API request object.
 * @returns A JSON response with the evaluation results.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Evaluation>>> {
  try {
    // Parse form data from the request
    const formData = await request.formData();
    const exam = formData.get("exam") as Exams;
    const question = formData.get("question") as string;
    const marks = formData.get("marks") as Marks;

    // Collect image files from form data
    const imageFiles: Blob[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("image-") && value instanceof Blob) {
        imageFiles.push(value);
      }
    });

    // Convert images to base64 format
    const imagesBase64 = await Promise.all(imageFiles.map(convertFileToBase64));

    // Predict subjects related to the given question
    const predictedSubjects = await predictSubject({ exam, question });

    // Retrieve subjects from the database based on predictions
    const selectedSubjects = await prisma.subject.findMany({
      where: {
        name: {
          in: predictedSubjects.subjectsRelatedToQuestion,
        },
      },
    });

    // Fetch general evaluation criteria
    const baseCriterias = await prisma.baseCriteria.findMany();

    // Fetch subject-specific evaluation criteria
    const subjectSpecificCriterias = await prisma.subjectCriteria.findMany({
      where: {
        subjectId: {
          in: selectedSubjects.map((subject) => subject.id),
        },
      },
    });

    // Calculate answer word limit based on marks
    const answerWordLimit = getWordsFromMarks(marks);

    // Prepare evaluation parameters
    const evaluationParameters = [
      ...baseCriterias.map((criteria) => ({
        parameter: criteria.parameter,
        logic: criteria.logic,
      })),
      ...subjectSpecificCriterias.map((criteria) => ({
        parameter: criteria.parameter,
        logic: criteria.logic,
      })),
    ];

    // Perform the evaluation
    const evaluation = (await evaluate({
      question,
      images: imagesBase64,
      answer_word_limit: answerWordLimit,
      output_format:
        StructuredOutputParser.fromZodSchema(
          evaluationSchema,
        ).getFormatInstructions(),
      evaluation_parameters: evaluationParameters,
    })) as Evaluation;

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Evaluation request processed successfully.",
      data: evaluation,
    });
  } catch (error) {
    console.error("Error processing Evaluate Answer Request", error);
    return NextResponse.json(
      {
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Error processing Evaluate Answer Request",
      },
      { status: 500 },
    );
  }
}
