"use client";

import { AnswerEvaluatorResult } from "answerwriting/components/dashboard/tools/answer-evaluater/result-answer-evaluator";
import { AnswerEvaluatorForm } from "answerwriting/components/dashboard/tools/answer-evaluater/form-answer-evaluator";
import Image from "next/image";
import { ToastAction } from "answerwriting/components/ui/toast";
import { ApiRoutePaths, ErrorCodes } from "answerwriting/types/general.types";
import { useRouter } from "next/navigation";
import { useCustomToast } from "answerwriting/components/react-common/toast";
import "pdfjs-dist/web/pdf_viewer.css";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { Marks, Exams } from "answerwriting/types/ai.types";
import { evaluateAnswer } from "answerwriting/lib/utils/api/ai.api";
import { useAsyncFn } from "react-use";

const convertPDFToImages = async (pdfFile: File): Promise<File[]> => {
  if (typeof window !== "undefined") {
    GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.279/pdf.worker.min.js";
  }

  const pdfBuffer = await pdfFile.arrayBuffer();
  const loadingTask = getDocument({ data: pdfBuffer });
  const pdf = await loadingTask.promise;
  const imageFiles: File[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 3.0 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const renderContext = { canvasContext: context, viewport };
      await page.render(renderContext).promise;

      // Convert canvas to Blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png", 1.0),
      );

      if (blob) {
        const file = new File([blob], `page-${i}.png`, { type: "image/png" });
        imageFiles.push(file);
      } else {
        console.error(`Failed to convert page ${i} to Blob`);
      }
    } else {
      console.error("Failed to get canvas context");
    }
  }

  return imageFiles;
};

export default function AnswerEvalTool() {
  const router = useRouter();
  const toast = useCustomToast();
  const [{ loading, value }, makeRequest] = useAsyncFn(
    async ({
      pdfFile,
      images,
      question,
      marks,
      exam,
    }: {
      pdfFile?: File;
      images?: File[];
      question: string;
      marks: Marks;
      exam: Exams;
    }) => {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("marks", marks);
      formData.append("exam", exam);

      let answerImages: File[] = [];
      if (pdfFile) {
        formData.append("answerPDF", pdfFile);
        answerImages = await convertPDFToImages(pdfFile);
      } else {
        if (images) {
          answerImages = images;
        }
      }
      answerImages.forEach((answerImage, index) => {
        formData.append(`image-${index}`, answerImage);
      });

      try {
        const result = await evaluateAnswer(formData);
        if (result.success) {
          toast.info({
            title: "Success!",
            description: "Your answer has been evaluated successfully!",
          });
          return result.data;
        } else {
          if (result.errorCode === ErrorCodes.UNAUTHORIZED) {
            toast.error({
              title: "Unauthorized",
              description:
                "You are not authorized to access this page. Please log in first.",
            });
            router.push(ApiRoutePaths.PAGE_LOGIN);
            return null;
          }
        }
      } catch (err) {
        console.error("Error evaluating answer:", err);
        toast.error({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem in the registration process.",
          action: (
            <ToastAction
              altText="Try again"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 hover:border-white/30 transition-all backdrop-blur-sm font-medium text-sm"
              onClick={() => window.location.reload()}
            >
              Try again
            </ToastAction>
          ),
        });
      }
    },
  );

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2">
        <Image
          src="/logos/1.png"
          height={100}
          width={100}
          alt="answerwriting logo"
          className="w-16 h-16"
        />
        <h1 className="text-primary-dark font-semibold text-3xl tracking-tighter leading-none">
          {" "}
          Answer Evaluator{" "}
        </h1>
      </div>
      <hr className="mt-4" />

      <div className="flex flex-col xl:flex-row">
        <div className="flex-1 border-r pt-4">
          <AnswerEvaluatorForm makeRequest={makeRequest} />
        </div>
        <div className="flex-1">
          <AnswerEvaluatorResult evaluationResults={value} loading={loading} />
        </div>
      </div>
    </div>
  );
}
