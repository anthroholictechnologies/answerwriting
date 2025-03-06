import { useRef } from "react";
import { Button } from "answerwriting/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "answerwriting/components/ui/form";
import { Input } from "answerwriting/components/ui/input";
import { Label } from "answerwriting/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "answerwriting/components/ui/select";
import { Switch } from "answerwriting/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "answerwriting/components/ui/tabs";
import { Textarea } from "answerwriting/components/ui/textarea";
import { Exams, Marks } from "answerwriting/types/ai.types";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import {
  SkipQuestionUploadToolTip,
  UploadQuestionToolTip,
} from "../tooltips/upload-question-tooltip";

export const QuestionInput = ({
  isQuestionAlreadyPresentInAnswer,
  setIsQuestionAlreadyPresentInAnswer,
  questionImage,
  setQuestionImage,
  form,
}: {
  isQuestionAlreadyPresentInAnswer: boolean;
  setIsQuestionAlreadyPresentInAnswer: (value: boolean) => void;
  questionImage: File | null;
  setQuestionImage: (value: File | null) => void;
  form: UseFormReturn<
    {
      question: string;
      marks: Marks;
      exam: Exams;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeQuestionImage = () => setQuestionImage(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setQuestionImage(file);
      form.setValue("question", "");
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {/* Question Details Card */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl text-primary-dark">
            Question Details
          </CardTitle>
          <CardDescription>
            {`Either type the question, upload an image of the question, or skip this part if your answer image already includes the question.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Question in Answer Switch */}
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="question-in-answer"
              checked={isQuestionAlreadyPresentInAnswer}
              onCheckedChange={(checked) => {
                setIsQuestionAlreadyPresentInAnswer(checked);
                if (checked) {
                  form.setValue("question", "");
                  setQuestionImage(null);
                }
              }}
            />
            <div className="flex gap-1">
              <Label htmlFor="question-in-answer" className="leading-1">
                Question already present in the answer image ?
              </Label>
              <SkipQuestionUploadToolTip />
            </div>
          </div>

          {!isQuestionAlreadyPresentInAnswer && (
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger
                  value="text"
                  className="flex items-center gap-2"
                  disabled={!!questionImage}
                >
                  <FileText className="h-4 w-4" /> Text
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="flex items-center gap-2"
                  disabled={
                    typeof form.getValues("question") === "string" &&
                    form.getValues("question") !== ""
                  }
                >
                  <ImageIcon className="h-4 w-4" /> Image
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text">
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
                          onChange={(e) => {
                            field.onChange(e);
                            setQuestionImage(null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="image">
                <div className="border-2 border-dashed rounded-lg p-4 md:p-8 text-center bg-muted/50">
                  <div className="flex flex-col items-center gap-4">
                    <ImageIcon className="h-12 w-12" />
                    <div className="flex gap-1">
                      <h3 className="font-semibold">Question too lengthy ?</h3>
                      <UploadQuestionToolTip />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Drop your question here or click to browse files
                    </p>

                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />

                    <Button
                      onClick={triggerFileInput}
                      className="w-full md:w-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" /> Browse
                    </Button>
                  </div>

                  {questionImage && (
                    <div className="mt-4 p-4 bg-background rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {questionImage.name}
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={removeQuestionImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 border rounded-md overflow-hidden h-[200px]">
                        <Image
                          width={300}
                          height={300}
                          src={URL.createObjectURL(questionImage)}
                          alt="Question"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Marks Selection */}
          <div className="mt-4">
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
          </div>
        </CardContent>
      </Card>
    </>
  );
};
