/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";
import { useState, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "answerwriting/components/ui/dialog";
import { Button } from "answerwriting/components/ui/button";
import { X, Camera, Check } from "lucide-react";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const webcamRef = useRef<Webcam>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, []);

  const retake = () => {
    setCapturedImage(null);
  };

  const getCroppedImg = useCallback((image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Preserve original image resolution
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    return new Promise<File>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(
              new File([blob], "captured-note.jpg", { type: "image/jpeg" })
            );
          }
        },
        "image/jpeg",
        1.0
      ); // Set quality to max
    });
  }, []);

  const confirmCrop = useCallback(async () => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageFile = await getCroppedImg(imgRef.current, crop);
      onCapture(croppedImageFile);
      onClose();
    }
  }, [crop, onCapture, onClose, getCroppedImg]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:hidden w-screen h-screen p-0 bg-black">
        <DialogTitle className="hidden">{""}</DialogTitle>

        <div className="relative w-full h-full overflow-hidden">
          {!capturedImage ? (
            <>
              <div className="w-full h-full fixed inset-0">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={1.0} // Highest quality capture
                  videoConstraints={{
                    facingMode: { exact: "environment" }, // Forces back camera
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="fixed bottom-4 left-0 right-0 flex justify-center">
                <Button onClick={capture} size="icon">
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-full fixed inset-0 flex items-center justify-center bg-black">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  className="w-full h-full"
                >
                  <img
                    ref={imgRef}
                    src={capturedImage}
                    alt="Captured note"
                    className="max-w-full max-h-full object-contain"
                  />
                </ReactCrop>
              </div>
              <div className="fixed bottom-4 left-0 right-0 flex justify-center space-x-4">
                <Button onClick={retake} size="icon" variant="secondary">
                  <X className="h-6 w-6" />
                </Button>
                <Button onClick={confirmCrop} size="icon">
                  <Check className="h-6 w-6" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
