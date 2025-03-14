"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  className?: string
  aspectRatio?: string
  width?: number
  height?: number
}

export default function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  className,
  aspectRatio = "16/9",
  width,
  height,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(false)

  // Handle video playback
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Update progress bar
  const updateProgress = () => {
    if (videoRef.current) {
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(percentage)
    }
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Determine video type
  const getVideoType = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return "youtube"
    } else if (url.includes("vimeo.com")) {
      return "vimeo"
    } else {
      return "standard"
    }
  }

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Extract Vimeo video ID
  const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(?:video\/)?([0-9]+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  const videoType = getVideoType(src)

  return (
    <div
      className={cn("relative overflow-hidden bg-black", aspectRatio && `aspect-[${aspectRatio}]`, className)}
      style={{ aspectRatio }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {videoType === "youtube" && (
        <iframe
          src={`https://www.youtube.com/embed/${getYouTubeId(src)}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`}
          title={title || "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          width={width}
          height={height}
        />
      )}

      {videoType === "vimeo" && (
        <iframe
          src={`https://player.vimeo.com/video/${getVimeoId(src)}?autoplay=${autoPlay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`}
          title={title || "Vimeo video player"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          width={width}
          height={height}
        />
      )}

      {videoType === "standard" && (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline
            onTimeUpdate={updateProgress}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
            width={width}
            height={height}
          />

          {controls && (
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity",
                showControls || !isPlaying ? "opacity-100" : "opacity-0",
              )}
            >
              {/* Progress bar */}
              <div
                className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
                onClick={(e) => {
                  if (videoRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const pos = (e.clientX - rect.left) / rect.width
                    videoRef.current.currentTime = pos * videoRef.current.duration
                  }
                }}
              >
                <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-primary transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-primary transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </button>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-primary transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

