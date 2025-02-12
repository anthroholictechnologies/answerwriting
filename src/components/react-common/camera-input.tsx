"use client";
import { CameraIcon, Check, FlipHorizontal, RotateCw } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedFile: File) => void;
}

interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  handle: "move" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | null;
  initialCrop: CropRegion | null;
}

const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [rotation, setRotation] = useState(0);
  const [cropRegion, setCropRegion] = useState<CropRegion | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    handle: null,
    initialCrop: null,
  });

  const initializeCropRegion = (imgWidth: number, imgHeight: number) => {
    const size = Math.min(imgWidth, imgHeight) * 0.8;
    setCropRegion({
      x: (imgWidth - size) / 2,
      y: (imgHeight - size) / 2,
      width: size,
      height: size,
    });
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      initializeCropRegion(naturalWidth, naturalHeight);
    }
  };

  const getRelativePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current || !imageRef.current) return { x: 0, y: 0 };

    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current;
    const scale = container.width / image.naturalWidth;

    return {
      x: (clientX - container.left) / scale,
      y: (clientY - container.top) / scale,
    };
  };

  const handleMouseDown = (
    e: React.MouseEvent | React.TouchEvent,
    handle: DragState["handle"] = "move"
  ) => {
    e.stopPropagation();
    if (!cropRegion) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const { x, y } = getRelativePosition(clientX, clientY);

    setDragState({
      isDragging: true,
      startX: x,
      startY: y,
      handle,
      initialCrop: { ...cropRegion },
    });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragState.isDragging || !dragState.initialCrop || !imageRef.current)
      return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const { x: currentX, y: currentY } = getRelativePosition(clientX, clientY);

    const deltaX = currentX - dragState.startX;
    const deltaY = currentY - dragState.startY;
    const initialCrop = dragState.initialCrop;
    const image = imageRef.current;

    const newCrop: CropRegion = { ...initialCrop };

    switch (dragState.handle) {
      case "move":
        newCrop.x = Math.max(
          0,
          Math.min(
            image.naturalWidth - initialCrop.width,
            initialCrop.x + deltaX
          )
        );
        newCrop.y = Math.max(
          0,
          Math.min(
            image.naturalHeight - initialCrop.height,
            initialCrop.y + deltaY
          )
        );
        break;

      case "topLeft":
        {
          const maxWidth = initialCrop.width + initialCrop.x;
          const maxHeight = initialCrop.height + initialCrop.y;
          const newWidth = Math.max(50, initialCrop.width - deltaX);
          const newHeight = Math.max(50, initialCrop.height - deltaY);

          newCrop.width = Math.min(newWidth, maxWidth);
          newCrop.height = Math.min(newHeight, maxHeight);
          newCrop.x = initialCrop.x + (initialCrop.width - newCrop.width);
          newCrop.y = initialCrop.y + (initialCrop.height - newCrop.height);
        }
        break;

      case "topRight":
        {
          const newWidth = Math.max(50, initialCrop.width + deltaX);
          const newHeight = Math.max(50, initialCrop.height - deltaY);

          newCrop.width = Math.min(
            newWidth,
            image.naturalWidth - initialCrop.x
          );
          newCrop.height = newHeight;
          newCrop.y = initialCrop.y + (initialCrop.height - newCrop.height);
        }
        break;

      case "bottomLeft":
        {
          const newWidth = Math.max(50, initialCrop.width - deltaX);
          const newHeight = Math.max(50, initialCrop.height + deltaY);

          newCrop.width = newWidth;
          newCrop.height = Math.min(
            newHeight,
            image.naturalHeight - initialCrop.y
          );
          newCrop.x = initialCrop.x + (initialCrop.width - newCrop.width);
        }
        break;

      case "bottomRight":
        {
          const newWidth = Math.max(50, initialCrop.width + deltaX);
          const newHeight = Math.max(50, initialCrop.height + deltaY);

          newCrop.width = Math.min(
            newWidth,
            image.naturalWidth - initialCrop.x
          );
          newCrop.height = Math.min(
            newHeight,
            image.naturalHeight - initialCrop.y
          );
        }
        break;
    }

    setCropRegion(newCrop);
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      startX: 0,
      startY: 0,
      handle: null,
      initialCrop: null,
    });
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleCrop = () => {
    if (!cropRegion || !imageRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to crop size
    canvas.width = cropRegion.width;
    canvas.height = cropRegion.height;

    // Draw cropped image
    ctx.drawImage(
      imageRef.current,
      cropRegion.x,
      cropRegion.y,
      cropRegion.width,
      cropRegion.height,
      0,
      0,
      cropRegion.width,
      cropRegion.height
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `cropped-image-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          onCropComplete(file);
          onClose();
        }
      },
      "image/jpeg",
      0.8
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            ref={containerRef}
            className="relative aspect-square w-full overflow-hidden rounded-lg bg-black"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleMouseUp}
          >
            <Image
              ref={imageRef}
              src={imageUrl}
              // width={300}
              // height={300}
              alt="To crop"
              className="w-full h-full object-contain"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
              onLoad={handleImageLoad}
            />
            {cropRegion && (
              <div
                className="absolute border-2 border-white cursor-move"
                style={{
                  left: `${(cropRegion.x / imageRef.current!.naturalWidth) * 100}%`,
                  top: `${(cropRegion.y / imageRef.current!.naturalHeight) * 100}%`,
                  width: `${(cropRegion.width / imageRef.current!.naturalWidth) * 100}%`,
                  height: `${(cropRegion.height / imageRef.current!.naturalHeight) * 100}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, "move")}
                onTouchStart={(e) => handleMouseDown(e, "move")}
                onMouseMove={handleMouseMove}
                onTouchMove={handleMouseMove}
              >
                <div className="absolute inset-0 border-2 border-white opacity-50" />

                {/* Resize handles */}
                <div
                  className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full cursor-nw-resize"
                  onMouseDown={(e) => handleMouseDown(e, "topLeft")}
                  onTouchStart={(e) => handleMouseDown(e, "topLeft")}
                />
                <div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full cursor-ne-resize"
                  onMouseDown={(e) => handleMouseDown(e, "topRight")}
                  onTouchStart={(e) => handleMouseDown(e, "topRight")}
                />
                <div
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full cursor-sw-resize"
                  onMouseDown={(e) => handleMouseDown(e, "bottomLeft")}
                  onTouchStart={(e) => handleMouseDown(e, "bottomLeft")}
                />
                <div
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full cursor-se-resize"
                  onMouseDown={(e) => handleMouseDown(e, "bottomRight")}
                  onTouchStart={(e) => handleMouseDown(e, "bottomRight")}
                />
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={rotate}>
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleCrop}>
                <Check className="h-4 w-4 mr-2" />
                Crop
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraReady(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Failed to access camera. Please make sure you have granted camera permissions."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraReady(false);
    }
  };

  const toggleCamera = async () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    await startCamera();
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (facingMode === "user") {
          // Flip horizontally for front camera
          ctx.scale(-1, 1);
          ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
          ctx.scale(-1, 1); // Reset transform
        } else {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        setCapturedImage(canvas.toDataURL("image/jpeg"));
        stopCamera();
      }
    }
  };

  const handleCropComplete = (file: File) => {
    onCapture(file);
    setCapturedImage(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (capturedImage) {
    return (
      <CropModal
        isOpen={isOpen}
        onClose={() => {
          setCapturedImage(null);
          startCamera();
        }}
        imageUrl={capturedImage}
        onCropComplete={handleCropComplete}
      />
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) =>
        !open &&
        (() => {
          onClose();
          stopCamera();
        })()
      }
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Take Photo</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleCamera}
              className="rounded-full"
            >
              <FlipHorizontal className="h-4 w-4" />
            </Button>

            <Button
              onClick={captureImage}
              className="rounded-full"
              disabled={!isCameraReady}
            >
              <CameraIcon className="h-4 w-4 mr-2" />
              Capture
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
