"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import { Button } from "answerwriting/components/ui/button";
import { Input } from "answerwriting/components/ui/input";
import Image from "next/image";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "answerwriting/components/ui/select";
// import { Exam } from "answerwriting/types";
import { X } from "lucide-react";

// const exams: Exam[] = [
//   {
//     id: "1",
//     name: "General Studies 1",
//     subjects: ["History"],
//   },
//   // Add more...
// ];

interface PromptFormProps {
  loading: boolean;
  onSubmit: (data: {
    question: string;
    // exam: string;
    // subject: string;
    images: File[];
  }) => void;
}

export default function PromptForm({ onSubmit }: PromptFormProps) {
  const [question, setQuestion] = useState("");
  // const [selectedExam, setSelectedExam] = useState("");
  // const [selectedSubject, setSelectedSubject] = useState("");
  const [images, setImages] = useState<File[]>([]);

  // const selectedExamSubjects =
  //   exams.find((e) => e.id === selectedExam)?.subjects || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 5 * 1024 * 1024) {
      alert("Total image size must be less than 5MB");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      question,
      // exam: selectedExam,
      // subject: selectedSubject,
      images,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Ask Your Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Question</label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Select Exam</label>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger>
                <SelectValue placeholder="Select an exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Select Subject</label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={!selectedExam}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {selectedExamSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Images (Max 3)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={images.length >= 3}
              className="cursor-pointer"
              multiple
            />
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                    width={64}
                    height={64}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              !question
              // || !selectedExam || !selectedSubject
            }
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
