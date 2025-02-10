import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import { UploadAnswerToolTip } from "../tooltips/upload-answer-tooltip";
import {
  TabsTrigger,
  TabsList,
  TabsContent,
  Tabs,
} from "answerwriting/components/ui/tabs";
import { Button } from "answerwriting/components/ui/button";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCustomToast } from "answerwriting/components/react-common/toast";
import {
  MAX_IMAGES_ALLOWED,
  MAX_PDF_UPLOAD_SIZE_BYTES,
  SINGLE_IMAGE_UPLOAD_SIZE_BYTES,
} from "answerwriting/config";
import { useRef } from "react";

export const FileUploader = ({
  pdfFile,
  setPdfFile,
  images,
  setImages,
}: {
  pdfFile: File | null;
  images: File[];
  setPdfFile: (file: File | null) => void;
  setImages: (files: File[]) => void;
}) => {
  const toast = useCustomToast();
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const selectedFile = event.target.files[0];

      if (selectedFile.size > MAX_PDF_UPLOAD_SIZE_BYTES) {
        toast.error({
          title: "PDF file too large",
          description: `Max size is ${MAX_PDF_UPLOAD_SIZE_BYTES / 1024 / 1024}MB.`,
        });
        return;
      }

      setPdfFile(selectedFile);
    }
  };

  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const newImages = Array.from(event.target.files).slice(
        0,
        MAX_IMAGES_ALLOWED,
      );

      if (newImages.some((img) => img.size > SINGLE_IMAGE_UPLOAD_SIZE_BYTES)) {
        toast.error({
          title: "Image too large",
          description: `Each image must be under ${
            SINGLE_IMAGE_UPLOAD_SIZE_BYTES / 1024 / 1024
          }MB.`,
        });
        return;
      }

      setImages([...images, ...newImages]);
    }
  };

  const removePdf = () => setPdfFile(null);
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Card className="md:shadow-sm md:hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl text-primary-dark">
            Upload Answer
          </CardTitle>
          <UploadAnswerToolTip />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger
              value="pdf"
              className="flex items-center gap-2"
              disabled={images.length > 0}
            >
              <FileText className="h-4 w-4" /> PDF
            </TabsTrigger>
            <TabsTrigger
              value="images"
              className="flex items-center gap-2"
              disabled={!!pdfFile}
            >
              <ImageIcon className="h-4 w-4" /> Images
            </TabsTrigger>
          </TabsList>

          {/* PDF Upload Section */}
          <TabsContent value="pdf">
            <div className="w-full border-2 border-dashed rounded-lg p-4 md:p-8 text-center bg-muted/50">
              <div className="flex flex-col items-center gap-4">
                <FileText className="h-12 w-12 text-primary-dark" />
                <h3 className="font-semibold text-primary-dark">
                  Drop your PDF here
                </h3>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>

                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                />

                <Button
                  disabled={images.length > 0}
                  onClick={() => pdfInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" /> Select PDF
                </Button>
              </div>

              {pdfFile && (
                <div className="mt-4 p-4 bg-background rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {pdfFile.name}
                    </p>
                    <Button size="icon" variant="ghost" onClick={removePdf}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 border rounded-md overflow-hidden h-[200px]">
                    <iframe
                      key={pdfFile?.name}
                      src={URL.createObjectURL(pdfFile)}
                      className="w-full h-[200px]"
                      title="PDF Preview"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Images Upload Section */}
          <TabsContent value="images">
            <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/50">
              <div className="flex flex-col items-center gap-4">
                <ImageIcon className="h-12 w-12 text-primary-dark" />
                <h3 className="font-semibold text-primary-dark">
                  Drop your images here
                </h3>
                <p className="text-sm text-muted-foreground">
                  or click to browse files (max {MAX_IMAGES_ALLOWED} images)
                </p>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImagesUpload}
                />

                <Button
                  disabled={
                    images.length === MAX_IMAGES_ALLOWED || pdfFile !== null
                  }
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" /> Select Images
                </Button>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative p-2 bg-background rounded-lg"
                    >
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-md"
                        height={200}
                        width={200}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-1 right-1"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
