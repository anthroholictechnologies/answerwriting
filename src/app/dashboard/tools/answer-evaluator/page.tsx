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
  const [activeTab, setActiveTab] = useState<string>("form");
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
      setActiveTab("results");
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
