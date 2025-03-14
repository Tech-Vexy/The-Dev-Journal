"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ResponsiveImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  fill?: boolean
  className?: string
  aspectRatio?: string
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  onClick?: () => void
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  fill = false,
  className,
  aspectRatio = "16/9",
  objectFit = "cover",
  onClick,
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Handle image loading errors
  useEffect(() => {
    setError(false)
    setIsLoading(true)
  }, [src])

  // Default placeholder for broken images
  const placeholderSrc = `/placeholder.svg?height=${height || 400}&width=${width || 600}`

  return (
    <div
      className={cn("overflow-hidden relative", !fill && aspectRatio && `aspect-[${aspectRatio}]`, className)}
      style={fill ? undefined : { aspectRatio }}
      onClick={onClick}
    >
      <Image
        src={error ? placeholderSrc : src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        className={cn(
          "transition-all duration-300",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down",
          isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
          onClick && "cursor-pointer",
        )}
      />
    </div>
  )
}

