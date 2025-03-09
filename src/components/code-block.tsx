"use client"

import React, { useEffect, useRef, useState } from "react"
import { Check, Copy, Terminal } from "lucide-react"
import Prism from "prismjs"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/components/prism-css"
import "prismjs/components/prism-scss"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-python"
import "prismjs/components/prism-php"
import "prismjs/components/prism-java"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-go"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-graphql"

const LANGUAGE_ALIASES = {
  js: "javascript",
  ts: "typescript",
  tsx: "tsx",
  jsx: "jsx",
  sh: "bash",
  shell: "bash",
  py: "python",
  rb: "ruby",
  cs: "csharp",
} as const

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  theme?: "light" | "dark" | "auto"
}

export default function CodeBlock({
  code,
  language = "",
  filename,
  showLineNumbers = true,
  theme = "auto",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Normalize language for Prism
  const normalizedLanguage = language?.toLowerCase() || ""
  const prismLanguage = LANGUAGE_ALIASES[normalizedLanguage as keyof typeof LANGUAGE_ALIASES] || normalizedLanguage

  // Apply Prism highlighting
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, prismLanguage])

  // Intersection Observer for lazy highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  // Add line numbers with proper accessibility
  const codeWithLineNumbers = code.split("\n").map((line, i) => (
    <div key={i} className="table-row group" role="row">
      {showLineNumbers && (
        <span
          className="table-cell pr-4 text-right select-none text-muted-foreground/50 w-10 group-hover:text-muted-foreground/70 transition-colors"
          role="cell"
          aria-label={`Line ${i + 1}`}
        >
          {i + 1}
        </span>
      )}
      <span className="table-cell font-mono" role="cell">
        {line || " "}
      </span>
    </div>
  ))

  return (
    <div 
      ref={containerRef}
      className={`group relative my-6 overflow-hidden rounded-lg border bg-card shadow-sm transition-all ${
        theme === "dark" ? "dark" : theme === "light" ? "light" : ""
      }`}
      data-language={prismLanguage || "plaintext"}
    >
      {/* Header with filename and language */}
      <div className="flex items-center justify-between bg-muted px-4 py-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 overflow-hidden">
          <Terminal className="h-4 w-4 flex-shrink-0" />
          {filename && (
            <span className="font-medium truncate" title={filename}>
              {filename}
            </span>
          )}
          {prismLanguage && <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{prismLanguage}</span>}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-muted-foreground/70 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
          aria-label={copied ? "Code copied" : "Copy code"}
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="text-xs hidden md:inline">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content with line numbers */}
      <div className="relative overflow-auto p-4 pt-2 text-sm">
        {isVisible && (
          <div 
            className="code-with-line-numbers font-mono leading-relaxed table w-full" 
            role="table" 
            aria-label={`Code snippet${filename ? ` for ${filename}` : ``}${prismLanguage ? ` in ${prismLanguage}` : ``}`}
          >
            {codeWithLineNumbers}
          </div>
        )}

        {/* Hidden pre element for Prism to highlight */}
        {isVisible && (
          <pre ref={codeRef} className={`language-${prismLanguage || "plaintext"} hidden`}>
            <code>{code}</code>
          </pre>
        )}

        {!isVisible && (
          <div className="animate-pulse flex space-x-4 h-32">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 bg-muted-foreground/20 rounded w-full"></div>
              <div className="h-2 bg-muted-foreground/20 rounded w-5/6"></div>
              <div className="h-2 bg-muted-foreground/20 rounded w-4/6"></div>
              <div className="h-2 bg-muted-foreground/20 rounded w-3/6"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}