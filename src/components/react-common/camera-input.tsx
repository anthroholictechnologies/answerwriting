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
import { X, Camera, RotateCcw, Check } from "lucide-react";

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
  const [isFrontCamera, setIsFrontCamera] = useState(false);
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

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const getCroppedImg = useCallback((image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
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
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(
            new File([blob], "captured-note.png", { type: "image/png" })
          );
        }
      }, "image/png");
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
      <DialogContent className="lg:hidden w-[100vw] h-[100dvh] p-0 bg-none">
        <DialogTitle className="hidden"> {""} </DialogTitle>
        <div className="relative w-full h-full">
          {!capturedImage ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                screenshotQuality={1} // Maximum quality
                videoConstraints={{
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                  facingMode: isFrontCamera ? "user" : "environment",
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <Button onClick={toggleCamera} size="icon" variant="secondary">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button onClick={capture} size="icon">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                className="w-[100vw] h-[100dvh]"
              >
                <img
                  ref={imgRef}
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured note"
                  className="w-[100vw] h-[100dvh]"
                />
              </ReactCrop>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <Button onClick={retake} size="icon" variant="secondary">
                  <X className="h-4 w-4" />
                </Button>
                <Button onClick={confirmCrop} size="icon">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
