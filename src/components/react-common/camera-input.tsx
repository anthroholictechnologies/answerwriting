/* eslint-disable @next/next/no-img-element */
"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import Webcam from "react-webcam"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Dialog, DialogContent } from "answerwriting/components/ui/dialog"
import { Button } from "answerwriting/components/ui/button"
import { X, Camera, Check } from "lucide-react"

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (file: File) => void
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  })
  const [isMobile, setIsMobile] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const videoConstraints = {
    width: { ideal: 3840 }, // 4K resolution for better quality
    height: { ideal: 2160 },
    facingMode: "environment",
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
    }
  }, [])

  const retake = () => {
    setCapturedImage(null)
  }

  const getCroppedImg = useCallback(async (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas")
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const cropX = (crop.x / 100) * image.width * scaleX
    const cropY = (crop.y / 100) * image.height * scaleY
    const cropWidth = (crop.width / 100) * image.width * scaleX
    const cropHeight = (crop.height / 100) * image.height * scaleY

    canvas.width = cropWidth
    canvas.height = cropHeight
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
    }

    return new Promise<File>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], "captured-note.jpg", { type: "image/jpeg" }))
          }
        },
        "image/jpeg",
        0.95, // High-quality compression
      )
    })
  }, [])

  const confirmCrop = useCallback(async () => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageFile = await getCroppedImg(imgRef.current, crop)
      onCapture(croppedImageFile)
      onClose()
    }
  }, [crop, onCapture, onClose, getCroppedImg])

  const modalContent = (
    <div className="relative flex flex-col h-full">
      <div className="flex-grow overflow-hidden">
        {!capturedImage ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
        ) : (
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} className="w-full h-full">
            <img
              ref={imgRef}
              src={capturedImage || "/placeholder.svg"}
              alt="Captured note"
              className="w-full h-full object-contain"
            />
          </ReactCrop>
        )}
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 z-10">
        {!capturedImage ? (
          <>
            <Button
              onClick={capture}
              size="icon"
              className="rounded-full w-16 h-16 bg-white text-black hover:bg-gray-200"
            >
              <Camera className="h-8 w-8" />
            </Button>
            <Button
              onClick={onClose}
              size="icon"
              variant="secondary"
              className="rounded-full bg-white text-black hover:bg-gray-200"
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
              className="rounded-full bg-white text-black hover:bg-gray-200"
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              onClick={confirmCrop}
              size="icon"
              className="rounded-full w-16 h-16 bg-white text-black hover:bg-gray-200"
            >
              <Check className="h-8 w-8" />
            </Button>
          </>
        )}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className={`fixed inset-0 bg-black z-50 ${isOpen ? "block" : "hidden"}`} style={{ height: "100dvh" }}>
        {modalContent}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 h-[80vh]">{modalContent}</DialogContent>
    </Dialog>
  )
}

