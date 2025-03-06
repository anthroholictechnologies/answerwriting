"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import { Button } from "answerwriting/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "answerwriting/components/ui/select";
import { Exams, Marks } from "answerwriting/types/ai.types";
import { SelectGSToolTip } from "./tooltips/select-gs-tooltip";
import { FileUploader } from "./form-parts/file-uploader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EvaluateAnswerAPIResponse,
  EvaluateAnswerInput,
  evaluateAnswerSchema,
} from "answerwriting/validations/ai.schema";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "answerwriting/components/ui/form";
import { QuestionInput } from "./form-parts/question-input";

export const AnswerEvaluatorForm = ({
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
      {/* Exam Selection Card */}
      <Card>
        <CardHeader>
          <div className="flex gap-2">
            <CardTitle className="text-xl text-primary-dark">
              Select GS
            </CardTitle>
            <SelectGSToolTip />
          </div>
          <CardDescription>
            Select the most appropriate GS paper for the question.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="exam"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select exam paper" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Exams).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <QuestionInput
        form={form}
        isQuestionAlreadyPresentInAnswer={isQuestionAlreadyPresentInAnswer}
        questionImage={questionImage}
        setIsQuestionAlreadyPresentInAnswer={
          setIsQuestionAlreadyPresentInAnswer
        }
        setQuestionImage={setQuestionImage}
      />

      <FileUploader
        pdfFile={pdfFile}
        setPdfFile={setPdfFile}
        images={images}
        setImages={setImages}
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

export default AnswerEvaluatorForm;
