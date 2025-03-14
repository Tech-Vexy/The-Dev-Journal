"use client"

import type React from "react"

import { useState } from "react"
import ResponsiveImage from "./responsive-image"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Image {
  url: string
  alt: string
  width?: number
  height?: number
}

interface ImageGalleryProps {
  images: Image[]
  columns?: 1 | 2 | 3 | 4
  gap?: number
  className?: string
}

export default function ImageGallery({ images, columns = 3, gap = 4, className }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImageIndex(null)
  }

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length)
    }
  }

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrevious()
    } else if (e.key === "ArrowRight") {
      goToNext()
    } else if (e.key === "Escape") {
      closeLightbox()
    }
  }

  return (
    <>
      <div
        className={cn(
          "grid gap-4",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
          columns === 4 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          className,
        )}
        style={{ gap: `${gap * 0.25}rem` }}
      >
        {images.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg cursor-pointer" onClick={() => openLightbox(index)}>
            <ResponsiveImage
              src={image.url}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

      <Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent
          className="max-w-screen-lg w-[95vw] p-0 bg-transparent border-none shadow-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative bg-black/90 rounded-lg overflow-hidden">
            <DialogClose className="absolute top-4 right-4 z-10">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>

            {selectedImageIndex !== null && (
              <div className="flex items-center justify-center p-4 h-[80vh]">
                <ResponsiveImage
                  src={images[selectedImageIndex].url}
                  alt={images[selectedImageIndex].alt}
                  className="max-h-full w-auto h-auto object-contain"
                  objectFit="contain"
                />
              </div>
            )}

            <div className="absolute inset-y-0 left-4 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
                <span className="sr-only">Previous image</span>
              </Button>
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {selectedImageIndex !== null && (
                <p className="text-sm">
                  {selectedImageIndex + 1} / {images.length}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

