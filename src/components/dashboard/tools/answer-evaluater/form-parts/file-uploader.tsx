"use client";
import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import {
  TabsTrigger,
  TabsList,
  TabsContent,
  Tabs,
} from "answerwriting/components/ui/tabs";
import { Button } from "answerwriting/components/ui/button";
import { FileText, ImageIcon, Upload, Camera, X } from "lucide-react";
import Image from "next/image";
import {
  MAX_IMAGES_ALLOWED,
  MAX_PDF_UPLOAD_SIZE_BYTES,
  SINGLE_IMAGE_UPLOAD_SIZE_BYTES,
} from "answerwriting/config";
import { CameraModal } from "answerwriting/components/react-common/camera-input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "answerwriting/components/ui/dialog";

const ImageGallery = ({
  images,
  removeImage,
}: {
  images: File[];
  removeImage: (index: number) => void;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      {images.length > 0 && (
        <div className="h-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => {
            const imageUrl = URL.createObjectURL(image);
            console.log("====imageUrl=" + imageUrl);
            return (
              <div
                key={index}
                className="relative p-2 bg-background rounded-lg cursor-pointer"
              >
                {/* Trigger Dialog on Click */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Image
                      src={imageUrl}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                      width={200}
                      height={200}
                      onClick={() => setSelectedImage(imageUrl)}
                    />
                  </DialogTrigger>

                  {/* Full Image Dialog */}
                  {selectedImage && (
                    <DialogContent
                      onInteractOutside={() => setSelectedImage(null)}
                      className="max-w-2xl"
                    >
                      <DialogTitle className="text-primary-dark">
                        Preview
                      </DialogTitle>
                      <div className="relative">
                        <Image
                          src={selectedImage}
                          alt="Full View"
                          className="w-full h-auto rounded-lg"
                          width={600}
                          height={600}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => setSelectedImage(null)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>

                {/* Remove Image Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-1 right-1"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

interface FileUploaderProps {
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  images: File[];
  setImages: (files: File[]) => void;
}
export const FileUploader: React.FC<FileUploaderProps> = ({
  pdfFile,
  setPdfFile,
  images,
  setImages,
}) => {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const selectedFile = event.target.files[0];
      if (selectedFile.size > MAX_PDF_UPLOAD_SIZE_BYTES) {
        alert(
          `PDF file too large. Max size is ${MAX_PDF_UPLOAD_SIZE_BYTES / 1024 / 1024}MB.`,
        );
        return;
      }
      setPdfFile(selectedFile);
    }
  };

  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const newImages = Array.from(event.target.files).slice(
        0,
        MAX_IMAGES_ALLOWED - images.length,
      );
      if (newImages.some((img) => img.size > SINGLE_IMAGE_UPLOAD_SIZE_BYTES)) {
        alert(
          `Each image must be under ${SINGLE_IMAGE_UPLOAD_SIZE_BYTES / 1024 / 1024}MB.`,
        );
        return;
      }
      setImages([...images, ...newImages]);
    }
  };

  const handleCameraCapture = (file: File) => {
    if (file.size > SINGLE_IMAGE_UPLOAD_SIZE_BYTES) {
      alert(
        `Image too large. Max size is ${SINGLE_IMAGE_UPLOAD_SIZE_BYTES / 1024 / 1024}MB.`,
      );
      return;
    }
    setImages([...images, file]);
  };

  const removePdf = () => setPdfFile(null);
  const removeImage = (index: number) =>
    setImages(images.filter((_, i) => i !== index));

  return (
    <Card className="w-full max-w-3xl mx-auto md:shadow-sm md:hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">Upload Answer</CardTitle>
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

          <TabsContent value="pdf">
            <div className="w-full border-2 border-dashed rounded-lg p-4 md:p-8 text-center bg-muted/50">
              <div className="flex flex-col items-center gap-4">
                <FileText className="h-12 w-12" />
                <h3 className="font-semibold">Drop your PDF here</h3>
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
                  className="w-full md:w-auto"
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
                      src={URL.createObjectURL(pdfFile)}
                      className="w-full h-full"
                      title="PDF Preview"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="border-2 border-dashed rounded-lg p-4 md:p-8 text-center bg-muted/50">
              <div className="flex flex-col items-center gap-4">
                <ImageIcon className="h-12 w-12" />
                <h3 className="font-semibold">Drop your images here</h3>
                <p className="text-sm text-muted-foreground">
                  or use one of the options below (max {MAX_IMAGES_ALLOWED}{" "}
                  images)
                </p>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImagesUpload}
                />

                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <Button
                    disabled={images.length === MAX_IMAGES_ALLOWED || !!pdfFile}
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full md:w-auto"
                  >
                    <Upload className="h-4 w-4 mr-2" /> Browse
                  </Button>

                  <div className="lg:hidden">
                    <Button
                      disabled={
                        images.length === MAX_IMAGES_ALLOWED || !!pdfFile
                      }
                      onClick={() => setIsCameraOpen(true)}
                      className="w-full md:w-auto"
                    >
                      <Camera className="h-4 w-4 mr-2" /> Camera
                    </Button>
                  </div>
                </div>
              </div>

              <ImageGallery images={images} removeImage={removeImage} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="lg:hidden">
          <CameraModal
            isOpen={isCameraOpen}
            onClose={() => setIsCameraOpen(false)}
            onCapture={handleCameraCapture}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
