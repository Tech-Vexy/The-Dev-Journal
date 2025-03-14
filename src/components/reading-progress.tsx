"use client"

import { useEffect, useState } from "react"

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const article = document.querySelector("article")
      if (!article) return

      const totalHeight = article.clientHeight - window.innerHeight
      const currentProgress = (window.scrollY / totalHeight) * 100
      setProgress(Math.min(100, Math.max(0, currentProgress)))
    }

    window.addEventListener("scroll", updateProgress)
    updateProgress()

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
      <div className="h-full bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
    </div>
  )
}

