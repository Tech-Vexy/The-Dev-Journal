"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type Heading = {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2, h3"))
    const headingElements = elements.map((element) => ({
      id: element.id,
      text: element.textContent || "",
      level: Number(element.tagName.charAt(1)),
    }))
    setHeadings(headingElements)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0% 0% -80% 0%" },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <nav className="space-y-2">
      <p className="font-medium mb-4">Table of Contents</p>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={cn(
            "block text-muted-foreground hover:text-foreground transition-colors",
            heading.level === 3 && "pl-4",
            activeId === heading.id && "text-foreground font-medium",
          )}
          onClick={(e) => {
            e.preventDefault()
            document.querySelector(`#${heading.id}`)?.scrollIntoView({
              behavior: "smooth",
            })
          }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  )
}

