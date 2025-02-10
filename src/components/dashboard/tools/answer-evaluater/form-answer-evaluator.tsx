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
import { Textarea } from "answerwriting/components/ui/textarea";
import { Label } from "answerwriting/components/ui/label";
import { Exams, Marks } from "answerwriting/types/ai.types";
import { SelectGSToolTip } from "./tooltips/select-gs-tooltip";
import { FileUploader } from "./form-parts/file-uploader";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EvaluateAnswerAPIResponse,
  EvaluateAnswerInput,
  evaluateAnswerSchema,
} from "answerwriting/validations/ai.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "answerwriting/components/ui/form";

export const AnswerEvaluatorForm = ({
  makeRequest,
}: {
  makeRequest: ({
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
  }) => Promise<EvaluateAnswerAPIResponse | null | undefined>;
}) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  console.log("====pdf", pdfFile);

  const form = useForm<EvaluateAnswerInput>({
    resolver: zodResolver(evaluateAnswerSchema),
    mode: "onChange",
    defaultValues: { question: "", exam: Exams.GS1, marks: Marks.FIFTEEN },
    shouldFocusError: true,
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-2 md:p-6 lg:h-[100vh] overflow-auto">
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

        {/* Question and Marks Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl text-primary-dark">
              Question Details
            </CardTitle>
            <CardDescription>
              Enter the question and select the marks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="question">Question</Label>
                  <FormControl>
                    <Textarea
                      id="question"
                      placeholder="Type your question here..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marks"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="marks">Marks</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select marks" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Marks).map((item) => (
                        <SelectItem key={item} value={item}>
                          {`${item} marks`}
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
            disabled={!(form.formState.isValid && (pdfFile || images.length))}
            onClick={() => {
              const { exam, marks, question } = form.getValues();
              makeRequest({
                exam,
                marks,
                question,
                pdfFile: pdfFile ?? undefined,
                images: images.length ? images : undefined,
              });
            }}
          >
            <Image
              src="/logos/1.png"
              height={100}
              width={100}
              alt="answerwriting logo"
              className="w-6 h-6"
            />
            Submit for Evaluation
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AnswerEvaluatorForm;
