"use client"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface LocalVideoProps {
  src: string
  poster?: string
  width?: number
  height?: number
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  preload?: "auto" | "metadata" | "none"
  className?: string
  onLoad?: () => void
  onError?: () => void
}

export default function LocalVideo({
  src,
  poster,
  width,
  height,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  preload = "metadata",
  className,
  onLoad,
  onError,
}: LocalVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    const handleLoadedData = () => {
      setIsLoaded(true)
      onLoad?.()
    }

    const handleError = () => {
      setHasError(true)
      onError?.()
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
    }
  }, [onLoad, onError])

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {!isLoaded && poster && (
        <div className="absolute inset-0 bg-black">
          <img
            src={poster || "/placeholder.svg"}
            alt="Video thumbnail"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        width={width}
        height={height}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        preload={preload}
        playsInline
        className={cn("w-full h-auto", !isLoaded && "invisible")}
      />

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 text-red-500">
          <p>Error loading video</p>
        </div>
      )}
    </div>
  )
}

