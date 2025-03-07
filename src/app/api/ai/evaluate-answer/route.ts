import { auth } from "answerwriting/auth";
import { getWordsFromMarks } from "answerwriting/lib/utils";
import { prisma } from "answerwriting/prisma";
import evaluate from "answerwriting/services/evaluate-answer/evaluation.service";
import predictSubject from "answerwriting/services/evaluate-answer/predictSubjects.service";
import { uploadFile } from "answerwriting/services/misc/s3.service";
import { Exams, Marks } from "answerwriting/types/ai.types";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";
import {
  detectQuestionSchema,
  EvaluateAnswerAPIResponse,
  Evaluation,
  evaluationSchema,
} from "answerwriting/validations/ai.schema";
import { StructuredOutputParser } from "langchain/output_parsers";
import { NextRequest, NextResponse } from "next/server";
import cuid from "cuid";
import { sumBy } from "lodash";
import { isRateLimitReached } from "answerwriting/services/rate-limit.service";
import detectQuestion from "answerwriting/services/evaluate-answer/extractQuestion.service";

export const maxDuration = 120;
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
  files: Blob[], // Accepts Blob instead of File
): Promise<string[]> {
  return Promise.all(
    files.map(async (file) => {
      const { buffer, contentType } = await convertBlobToBuffer(file);
      const path = `answers/${userId}/${answerId}/${cuid()}.${contentType.split("/")[1]}`;
      await uploadFile({ fileBuffer: buffer, filePath: path, contentType });
      return path;
    }),
  );
}

// Helper function to convert Blob to Buffer
async function convertBlobToBuffer(
  blob: Blob,
): Promise<{ buffer: Buffer; contentType: string }> {
  const arrayBuffer = await blob.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), contentType: blob.type };
}

/**
 * Handles the evaluation request by processing the uploaded answer images and question details.
 * @param request - The Next.js API request object.
 * @returns A JSON response with the evaluation results.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<EvaluateAnswerAPIResponse>>> {
  try {
    console.log(
      "Evaluate Answer API - Check if the user is authenticated or not...",
    );
    // Authenticate user
    const session = await auth();
    const user = session?.user;
    if (!user) {
      console.error("Evaluate Answer API - User not authenticated...");
      return NextResponse.json(
        {
          success: false,
          errorCode: ErrorCodes.UNAUTHORIZED,
          message: "User not authenticated.",
        },
        { status: 401 },
      );
    }

    console.error(
      `Evaluate Answer API - Checking in if the user ${user.id}  has answers quota left...`,
    );
    if (await isRateLimitReached(user.id)) {
      console.error(
        `Evaluate Answer API - user ${user.id} has no answers quota left...`,
      );
      return NextResponse.json(
        {
          success: false,
          errorCode: ErrorCodes.TOO_MANY_REQUESTS_FOR_EVALUATION,
          message: "Please upgrade to pro to continue evaluating",
        },
        { status: 429 },
      );
    }

    console.log(`Parsing the form data...`);
    // Parse form data
    const formData = await request.formData();

    // Exam and marks are compulsory
    const exam = formData.get("exam") as Exams;
    const marks = formData.get("marks") as Marks;

    console.log(
      `Evaluate Answer API - Exam ==== ${exam} and marks ==== ${marks}`,
    );

    // Question can come as image or string or may not come
    const question = formData.get("question") as string | undefined;
    const questionImage = formData.get("questionImage") as Blob | undefined;

    console.log(
      `Evaluate Answer API - ${question ? "Question is typed and passed" : ""} ${questionImage ? "Question Image is uploaded" : ""} ${!question && !questionImage ? "No question passed from FE" : ""}`,
    );

    // Answer may come as images or a pdf file
    const answerPDF = formData.get("answerPDF") as Blob | undefined;
    const imageFiles: Blob[] = Array.from(formData.entries())
      .filter(
        ([key, value]) => key.startsWith("image-") && value instanceof Blob,
      )
      .map(([, value]) => value as Blob);

    console.log(
      `Evaluate Answer API - ${answerPDF ? "Answer uploaded as PDF" : ""} ${imageFiles ? "Answer Uploaded as Images" : ""}`,
    );

    const userId = user.id;
    const answerId = cuid();
    console.log("Evaluate Answer API - form data parsed");

    // Upload files to S3
    const [pdfPath, imagesPath] = await Promise.all([
      answerPDF
        ? uploadFile({
            fileBuffer: Buffer.from(await answerPDF.arrayBuffer()), // Fix: Convert Blob to Buffer
            filePath: `answers/${userId}/${answerId}/${cuid()}.pdf`,
            contentType: answerPDF.type, // Fix: Pass Content-Type
          })
        : Promise.resolve(null),
      uploadFiles(userId, answerId, imageFiles),
    ]);

    console.log("Evaluate Answer API - files uploaded to S3 bucket");

    let finalQuestion: string = "";
    if (question) {
      console.log(
        `Evaluate Answer API - Assigning final Question as typed question ${question}`,
      );
      finalQuestion = question;
    } else if (questionImage) {
      const questionImageBase64 = await convertBlobToBase64(questionImage);
      const response = await detectQuestion({
        image: questionImageBase64,
        output_format:
          StructuredOutputParser.fromZodSchema(
            detectQuestionSchema,
          ).getFormatInstructions(),
      });

      if (response.detectedQuestion === "") {
        return NextResponse.json({
          errorCode: ErrorCodes.UNABLE_TO_DETECT_QUESTION,
          success: false,
          message:
            "Unable to detect question from the uploaded image. Please try again with a clearer image.",
        });
      }

      console.log(
        `Evaluate Answer API - Extracting the question from the question image ${response.detectedQuestion}`,
      );
      finalQuestion = response.detectedQuestion;
    } else if (!question && !questionImage) {
      const firstImageBase64 = await convertBlobToBase64(imageFiles[0]);
      const response = await detectQuestion({
        image: firstImageBase64,
        output_format:
          StructuredOutputParser.fromZodSchema(
            detectQuestionSchema,
          ).getFormatInstructions(),
      });

      if (response.detectedQuestion === "") {
        return NextResponse.json({
          errorCode: ErrorCodes.UNABLE_TO_DETECT_QUESTION,
          success: false,
          message:
            "Unable to detect question from the uploaded image / pdf. Please try again with a clearer image or pdf.",
        });
      }

      console.log(
        `Evaluate Answer API - Extracting the question from the answer's first image ${response.detectedQuestion}`,
      );
      finalQuestion = response.detectedQuestion;
    }

    console.log(
      "Evaluate Answer API - Starting the predict subject model call",
    );
    // Predict subjects based on the question
    const predictedSubjects = await predictSubject({
      exam,
      question: finalQuestion,
    });

    console.log("Evaluate Answer API - subjects predicted", predictedSubjects);

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
    const base64Urls = await Promise.all(imageFiles.map(convertBlobToBase64));

    console.log("Evaluate Answer API - Predicting the evaluation");
    // Perform evaluation
    const evaluation = (await evaluate({
      question: finalQuestion,
      images: base64Urls,
      answer_word_limit: getWordsFromMarks(marks),
      output_format:
        StructuredOutputParser.fromZodSchema(
          evaluationSchema,
        ).getFormatInstructions(),
      evaluation_parameters: evaluationParameters,
    })) as Evaluation;

    console.log("====evaluation===", evaluation);

    // Save evaluation result to the database
    await prisma.answer.create({
      data: {
        id: answerId,
        userId,
        exam,
        question: finalQuestion,
        marks,
        evaluationJson: JSON.stringify(evaluation),
        pdfPath: pdfPath ?? "",
        imagesPath,
      },
    });

    // Total score calculation logic
    const baseParamsWeightage = 0.3 * Number(marks);
    const subjectSpecificParamsWeightage = 0.5 * Number(marks);
    const baseParamScores = evaluation.parameter_scores.filter(
      (ps) => ps.category === "base_parameter",
    );
    const subjectSpecificParamScores = evaluation.parameter_scores.filter(
      (ps) => ps.category === "subject_specific_parameter",
    );

    const marksScoredBaseParams =
      (sumBy(baseParamScores, (ps) => ps.score) /
        (baseParamScores.length * 10)) *
      baseParamsWeightage;
    const marksScoredSubjectSpecificParams =
      (sumBy(subjectSpecificParamScores, (ps) => ps.score) /
        (subjectSpecificParamScores.length * 10)) *
      subjectSpecificParamsWeightage;

    let totalScore = marksScoredBaseParams + marksScoredSubjectSpecificParams;

    if (
      totalScore >= 0.45 * Number(marks) &&
      totalScore <= 0.65 * Number(marks)
    ) {
      if (evaluation.current_relevance) {
        totalScore += 1;
      } else if (evaluation.visual_aid) {
        totalScore += 1;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Evaluation request processed successfully.",
      data: {
        current_relevance: evaluation.current_relevance,
        summary: evaluation.summary,
        exam,
        improved_answer: evaluation.improved_answer,
        marks,
        overall_feedback: evaluation.overall_feedback,
        question: finalQuestion,
        visual_aid: evaluation.visual_aid,
        marksScored: Math.round(totalScore),
      },
    });
  } catch (error) {
    console.error("Error processing Evaluate Answer Request", error);
    return NextResponse.json(
      {
        success: false,
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: "Error processing Evaluate Answer Request",
      },
      { status: 500 },
    );
  }
}

// Helper function to convert Blob to Base64
async function convertBlobToBase64(blob: Blob): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return `data:${blob.type};base64,${buffer.toString("base64")}`;
}
