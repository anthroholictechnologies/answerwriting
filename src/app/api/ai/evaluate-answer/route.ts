import { auth } from "answerwriting/auth";
import { getWordsFromMarks } from "answerwriting/lib/utils";
import { prisma } from "answerwriting/prisma";
import evaluate from "answerwriting/services/evaluate-answer/evaluation.service";
import predictSubject from "answerwriting/services/evaluate-answer/predictSubjects.service";
import { uploadFile } from "answerwriting/services/misc/s3.service";
import { Exams, Marks } from "answerwriting/types/ai.types";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";
import {
  Evaluation,
  evaluationSchema,
} from "answerwriting/validations/ai.schema";
import { StructuredOutputParser } from "langchain/output_parsers";
import { NextRequest, NextResponse } from "next/server";
import cuid from "cuid";

/**
 * Converts a file to a base64 string.
 * @param file - The file to be converted.
 * @returns A promise that resolves to a base64-encoded string.
 */
async function convertFileToBase64(file: Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return `data:${file.type};base64,${Buffer.from(arrayBuffer).toString("base64")}`;
}

/**
 * Uploads files to S3 and returns their paths.
 * @param userId - ID of the user.
 * @param answerId - Unique ID for the answer.
 * @param files - List of files to be uploaded.
 * @returns A promise resolving to an array of uploaded file paths.
 */
async function uploadFiles(
  userId: string,
  answerId: string,
  files: File[]
): Promise<string[]> {
  const paths: string[] = [];
  await Promise.all(
    files.map(async (file) => {
      const path = `answers/${userId}/${answerId}/${cuid()}.${file.type.split("/")[1]}`;
      await uploadFile({ file, filePath: path });
      paths.push(path);
    })
  );
  return paths;
}

/**
 * Handles the evaluation request by processing the uploaded answer images and question details.
 * @param request - The Next.js API request object.
 * @returns A JSON response with the evaluation results.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Evaluation>>> {
  try {
    // Authenticate user
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          errorCode: ErrorCodes.UNAUTHORIZED,
          message: "User not authenticated.",
        },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const exam = formData.get("exam") as Exams;
    const question = formData.get("question") as string;
    const marks = formData.get("marks") as Marks;
    const answerPDF = formData.get("answerPDF") as File;
    const imageFiles: File[] = Array.from(formData.entries())
      .filter(
        ([key, value]) => key.startsWith("image-") && value instanceof File
      )
      .map(([, value]) => value as File);

    const userId = user.id;
    const answerId = cuid();

    // Upload files to S3
    const [pdfPath, imagesPath] = await Promise.all([
      uploadFile({
        file: answerPDF,
        filePath: `answers/${userId}/${answerId}/${cuid()}.pdf`,
      }),
      uploadFiles(userId, answerId, imageFiles),
    ]);

    // Predict subjects based on the question
    const predictedSubjects = await predictSubject({ exam, question });

    // Retrieve relevant subjects and evaluation criteria from the database
    const [selectedSubjects, baseCriterias] = await Promise.all([
      prisma.subject.findMany({
        where: { name: { in: predictedSubjects.subjectsRelatedToQuestion } },
      }),
      prisma.baseCriteria.findMany(),
    ]);

    const subjectSpecificCriterias = await prisma.subjectCriteria.findMany({
      where: {
        subjectId: { in: selectedSubjects.map((subject) => subject.id) },
      },
    });

    // Prepare evaluation parameters
    const evaluationParameters = [
      ...baseCriterias.map(({ parameter, logic }) => ({
        parameter,
        logic,
        category: "base_parameter",
      })),
      ...subjectSpecificCriterias.map(({ parameter, logic }) => ({
        parameter,
        logic,
        category: "subject_specific_parameter",
      })),
    ];

    // Convert images to base64
    const base64Urls = await Promise.all(imageFiles.map(convertFileToBase64));

    // Perform evaluation
    const evaluation = (await evaluate({
      question,
      images: base64Urls,
      answer_word_limit: getWordsFromMarks(marks),
      output_format:
        StructuredOutputParser.fromZodSchema(
          evaluationSchema
        ).getFormatInstructions(),
      evaluation_parameters: evaluationParameters,
    })) as Evaluation;

    // Save evaluation result to the database
    await prisma.answer.create({
      data: {
        id: answerId,
        userId,
        exam,
        question,
        marks,
        evaluationJson: JSON.stringify(evaluation),
        pdfPath,
        imagesPath,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Evaluation request processed successfully.",
      data: evaluation,
    });
  } catch (error) {
    console.error("Error processing Evaluate Answer Request", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: "Error processing Evaluate Answer Request",
      },
      { status: 500 }
    );
  }
}
