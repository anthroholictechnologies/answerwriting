/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent } from "answerwriting/components/ui/dialog";
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
  const [isMobile, setIsMobile] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    canvas.width = crop.width;
    canvas.height = crop.height;
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
        crop.width,
        crop.height,
      );
    }

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], "captured-note.png", { type: "image/png" }));
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

  const modalContent = (
    <div className="relative flex flex-col h-full">
      <div className="flex-grow">
        {!capturedImage ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotQuality={1}
            screenshotFormat="image/png"
            videoConstraints={{
              facingMode: "environment",
              width: 3840,
              height: 2160,
              aspectRatio: 3 / 4,
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            className="w-full h-full"
          >
            <img
              ref={imgRef}
              src={capturedImage || "/placeholder.svg"}
              alt="Captured note"
              className="w-full h-full object-contain"
            />
          </ReactCrop>
        )}
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        {!capturedImage ? (
          <>
            <Button
              onClick={capture}
              size="icon"
              className="rounded-full w-16 h-16"
            >
              <Camera className="h-8 w-8" />
            </Button>
            <Button
              onClick={onClose}
              size="icon"
              variant="secondary"
              className="rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={retake}
              size="icon"
              variant="secondary"
              className="rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              onClick={confirmCrop}
              size="icon"
              className="rounded-full w-16 h-16"
            >
              <Check className="h-8 w-8" />
            </Button>
          </>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        className={`fixed inset-0 bg-black z-50 ${isOpen ? "block" : "hidden"}`}
        style={{ height: "100dvh" }}
      >
        {modalContent}
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 h-[80vh]">
        {modalContent}
      </DialogContent>
    </Dialog>
  );
};
