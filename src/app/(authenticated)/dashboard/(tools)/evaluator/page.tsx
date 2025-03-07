"use client";
import { AnswerEvaluatorResult } from "answerwriting/components/dashboard/tools/answer-evaluater/result-answer-evaluator";
import { AnswerEvaluatorForm } from "answerwriting/components/dashboard/tools/answer-evaluater/form-answer-evaluator";
import { ToastAction } from "answerwriting/components/ui/toast";
import { ApiRoutePaths, ErrorCodes } from "answerwriting/types/general.types";
import { useRouter } from "next/navigation";
import { useCustomToast } from "answerwriting/components/react-common/toast";
import { Marks, Exams } from "answerwriting/types/ai.types";
import { evaluateAnswer } from "answerwriting/lib/utils/api/ai.api";
import { useAsyncFn } from "react-use";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "answerwriting/components/ui/tabs";
import { CheckCircle, PenIcon } from "lucide-react";
import { useState } from "react";
import "pdfjs-dist/web/pdf_viewer.css";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import ToolHeading from "answerwriting/components/dashboard/tools/tool-heading";
import { MAX_PAYLOAD_SIZE } from "answerwriting/config";

const convertPDFToImages = async (pdfFile: File): Promise<File[]> => {
  if (typeof window !== "undefined") {
    GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.279/pdf.worker.min.js";
  } else {
    throw new Error("This function must be run in a browser environment.");
  }

  const pdfBuffer = new Uint8Array(await pdfFile.arrayBuffer());

  let pdf;
  try {
    const loadingTask = getDocument({ data: pdfBuffer });
    pdf = await loadingTask.promise;
  } catch (error) {
    console.error("Error loading PDF:", error);
    return [];
  }

  const imageFiles: File[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const renderContext = { canvasContext: context, viewport };
      await page.render(renderContext).promise;

      // Convert canvas to Blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.8),
      );

      if (blob) {
        const file = new File([blob], `page-${i}.webp`, { type: "image/webp" });
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
  const [activeTab, setActiveTab] = useState<string>("form");
  const router = useRouter();
  const toast = useCustomToast();
  const [{ loading, value }, makeRequest] = useAsyncFn(
    async ({
      pdfFile,
      images,
      question,
      questionImage,
      marks,
      exam,
    }: {
      pdfFile?: File;
      images?: File[];
      question?: string;
      marks: Marks;
      exam: Exams;
      questionImage?: File;
    }) => {
      setActiveTab("results");
      let totalSize = 0;
      const formData = new FormData();
      if (question) {
        totalSize += new Blob([question]).size;
        formData.append("question", question);
      }

      if (questionImage) {
        totalSize += questionImage.size;
        formData.append("questionImage", questionImage);
      }

      formData.append("marks", marks);
      totalSize += new Blob([marks]).size;

      formData.append("exam", exam);
      totalSize += new Blob([exam]).size;

      let answerImages: File[] = [];
      if (pdfFile) {
        formData.append("answerPDF", pdfFile);
        console.log("pdfFile Size====", pdfFile.size, totalSize);
        totalSize += pdfFile.size;
        answerImages = await convertPDFToImages(pdfFile);
      } else {
        if (images) {
          answerImages = images;
        }
      }
      answerImages.forEach((answerImage, index) => {
        totalSize += answerImage.size;
        console.log("answerImage Size====", answerImage.size, totalSize);
        formData.append(`image-${index}`, answerImage);
      });

      if (totalSize > MAX_PAYLOAD_SIZE) {
        toast.error({
          title: "Answer file size too large",
          description:
            "Please try to reduce the number of images or number of PDF pages.",
        });
        return null;
      }

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
          } else if (
            result.errorCode === ErrorCodes.UNABLE_TO_DETECT_QUESTION
          ) {
            toast.error({
              title: "Unable to Detect Question",
              description: result.message,
            });
          } else if (
            result.errorCode === ErrorCodes.TOO_MANY_REQUESTS_FOR_EVALUATION
          ) {
            toast.error({
              title: "You are out of your free quota.",
              description:
                "Please Upgrade to PRO to continue evaluating your answers.",
              action: (
                <ToastAction
                  altText="Try again"
                  className="px-2 md:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 hover:border-white/30 transition-all backdrop-blur-sm font-medium text-sm"
                  onClick={() => router.push(ApiRoutePaths.PAGE_UPGRADE)}
                >
                  Upgrade
                </ToastAction>
              ),
            });
          }
        }
      } catch (err) {
        console.error("Error evaluating answer:", err);
        toast.error({
          title: "Server Busy!! Please try again after some time.",
          description: "There was a problem in evaluating your answer.",
          action: (
            <ToastAction
              altText="Try again"
              className="px-2 md:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 hover:border-white/30 transition-all backdrop-blur-sm font-medium text-sm"
              onClick={() => window.location.reload()}
            >
              Try again
            </ToastAction>
          ),
        });
      }
    },
  );

  const AnswerEvalForm = () => {
    return (
      <div className="hidden lg:block">
        <ToolHeading heading="Answer Evaluator" />
        <div className="flex">
          <div className="flex-1 border border-gray-200 max-w-3xl mx-auto space-y-6 px-6 py-12">
            <AnswerEvaluatorForm makeRequest={makeRequest} />
          </div>
          <div className="flex-1 border border-gray-200 max-w-3xl mx-auto px-6 py-12">
            <AnswerEvaluatorResult
              evaluationResults={value}
              loading={loading}
            />
          </div>
        </div>
      </div>
    );
  };

  const AnswerEvalFormMobile = () => {
    return (
      <div className="lg:hidden">
        <ToolHeading heading="Answer Evaluator" />
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-4 p-4"
        >
          <TabsList className="grid w-full grid-cols-2 h-12 mb-4 bg-primary-dark text-white">
            <TabsTrigger
              value="form"
              className="flex items-center h-10 gap-2 bg-primary-dark"
            >
              <PenIcon className="h-4 w-4" /> Form
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="flex items-center h-10 gap-2 bg-primary-dark"
            >
              <CheckCircle className="h-4 w-4" /> Results
            </TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <div className="max-w-3xl space-y-6 pb-6">
              <AnswerEvaluatorForm makeRequest={makeRequest} />
            </div>
          </TabsContent>
          <TabsContent value="results">
            <div className="max-w-3xl space-y-6 pb-6">
              <AnswerEvaluatorResult
                evaluationResults={value}
                loading={loading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div>
      <AnswerEvalForm />
      <AnswerEvalFormMobile />
    </div>
  );
}
