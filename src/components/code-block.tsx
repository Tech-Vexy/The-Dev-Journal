"use client"

import { useState, useEffect } from "react"
import { Check, Copy, Terminal } from "lucide-react"
import Prism from "prismjs"

// Import Prism core styles
import "prismjs/themes/prism-tomorrow.css"

// Import common languages
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-scss"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-go"
import "prismjs/components/prism-json"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-sql"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  highlightLines?: number[]
}

export default function CodeBlock({ code, language = "", filename, highlightLines = [] }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState("")

  // Normalize language for display and Prism
  const normalizedLanguage = language ? language.toLowerCase() : ""
  const prismLanguage =
    normalizedLanguage === "js"
      ? "javascript"
      : normalizedLanguage === "ts"
        ? "typescript"
        : normalizedLanguage === "sh" || normalizedLanguage === "shell"
          ? "bash"
          : normalizedLanguage || "text"

  // Display language name
  const displayLanguage = prismLanguage === "text" ? "" : prismLanguage

  // Apply Prism highlighting when component mounts or code/language changes
  useEffect(() => {
    if (code && prismLanguage !== "text") {
      const highlighted = Prism.highlight(code, Prism.languages[prismLanguage] || Prism.languages.plain, prismLanguage)
      setHighlightedCode(highlighted)
    } else {
      setHighlightedCode("")
    }
  }, [code, prismLanguage])

  const copyToClipboard = async () => {
    if (!code) return

    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  // Safely handle code splitting
  const codeLines = code ? code.split("\n") : [""]

  // Add line numbers and handle line highlighting with Prism syntax highlighting
  const codeWithLineNumbers = codeLines.map((line, i) => {
    const isHighlighted = highlightLines?.includes(i + 1) || false

    // If we have highlighted code, use it, otherwise use the plain line
    const lineContent = highlightedCode ? highlightedCode.split("\n")[i] || " " : line || " "

    return (
      <div
        key={i}
        className={`table-row ${isHighlighted ? "bg-primary/15 dark:bg-primary/20 -mx-4 px-4" : ""}`}
        data-highlighted={isHighlighted}
      >
        <span className="table-cell pr-4 text-right select-none text-neutral-500 dark:text-neutral-400 w-10 opacity-60">
          {i + 1}
        </span>
        {highlightedCode ? (
          <span className="table-cell whitespace-pre dark:text-neutral-200" dangerouslySetInnerHTML={{ __html: lineContent }} />
        ) : (
          <span className="table-cell whitespace-pre dark:text-neutral-200">{lineContent}</span>
        )}
      </div>
    )
  })

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 shadow-sm">
      {/* Header with filename and language */}
      <div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          {filename && <span className="font-medium">{filename}</span>}
          {displayLanguage && <span className="text-xs text-neutral-500 dark:text-neutral-400">{displayLanguage}</span>}
        </div>
        <button
          onClick={copyToClipboard}
          className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* Code content with line numbers */}
      <div className="relative overflow-x-auto p-4 pt-3 text-sm bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
        <div className="code-with-line-numbers font-mono leading-relaxed overflow-x-auto">
          <div className="table w-full">{codeWithLineNumbers}</div>
        </div>
      </div>
    </div>
  )
}