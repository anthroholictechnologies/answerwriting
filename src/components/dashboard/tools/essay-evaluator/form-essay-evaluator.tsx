"use client";
import React, { useState } from "react";
import { Exams, Marks } from "answerwriting/types/ai.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EvaluateAnswerAPIResponse,
  EvaluateAnswerInput,
  evaluateAnswerSchema,
} from "answerwriting/validations/ai.schema";
import { Form } from "answerwriting/components/ui/form";
import { QuestionInput } from "answerwriting/components/react-common/inputs/question";
import FileUploader from "../answer-evaluater/form-parts/file-uploader";
import {
  SkipEssayTopicToolTip,
  UploadEssayToolTip,
} from "../answer-evaluater/tooltips/upload-question-tooltip";
import { Button } from "answerwriting/components/ui/button";

export const EssayEvaluatorForm = ({
  makeRequest,
}: {
  makeRequest: ({
    pdfFile,
    images,
    question,
    marks,
    exam,
    questionImage,
    questionInAnswer,
  }: {
    pdfFile?: File;
    images?: File[];
    question?: string;
    marks: Marks;
    exam: Exams;
    questionImage?: File;
    questionInAnswer: boolean;
  }) => Promise<EvaluateAnswerAPIResponse | null | undefined>;
}) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [
    isQuestionAlreadyPresentInAnswer,
    setIsQuestionAlreadyPresentInAnswer,
  ] = useState(false);

  const form = useForm<EvaluateAnswerInput>({
    resolver: zodResolver(evaluateAnswerSchema),
    mode: "onChange",
    defaultValues: {
      question: "",
      exam: Exams.GS1,
      marks: Marks.FIFTEEN,
    },
    shouldFocusError: true,
  });

  return (
    <Form {...form}>
      <QuestionInput
        form={form}
        isQuestionAlreadyPresentInAnswer={isQuestionAlreadyPresentInAnswer}
        questionImage={questionImage}
        setIsQuestionAlreadyPresentInAnswer={
          setIsQuestionAlreadyPresentInAnswer
        }
        setQuestionImage={setQuestionImage}
        looks={{
          mainHeading: "Essay Topic/Question Details",
          mainDescription:
            "Either type the question, upload an image of the question, or skip this part if your essay image already includes the question",
          skipQuestionLabel: "Question already present in the essay image ?",
          questionTextLabel: "Essay topic/question",
          skipQuestionUploadToolTip: <SkipEssayTopicToolTip />,
          uploadQuestionImageToolTip: <UploadEssayToolTip />,
          questionPlaceHolder: "Type your essay topic/question here...",
        }}
      />

      <FileUploader
        pdfFile={pdfFile}
        setPdfFile={setPdfFile}
        images={images}
        setImages={setImages}
        looks={{
          heading: "Upload Essay",
        }}
      />

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          type="submit"
          className="flex gap-2"
          disabled={
            isQuestionAlreadyPresentInAnswer
              ? !(
                  (pdfFile || images.length) &&
                  form.getValues("marks") &&
                  form.getValues("exam")
                )
              : !(
                  (pdfFile || images.length) &&
                  (questionImage || form.getValues("question")) &&
                  form.getValues("marks") &&
                  form.getValues("exam")
                )
          }
          onClick={() => {
            const { exam, marks, question } = form.getValues();
            makeRequest({
              exam,
              marks,
              question,
              pdfFile: pdfFile ?? undefined,
              images: images.length ? images : undefined,
              questionImage: questionImage ?? undefined,
              questionInAnswer: isQuestionAlreadyPresentInAnswer,
            });
          }}
        >
          Submit for Evaluation
        </Button>
      </div>
    </Form>
  );
};

export default EssayEvaluatorForm;
