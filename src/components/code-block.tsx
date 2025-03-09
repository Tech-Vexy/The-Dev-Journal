"use client"

import React, { useEffect, useRef } from "react"
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

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  highlightLines?: number[]
}

export default function CodeBlock({ code, language = "", filename, highlightLines = [] }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  // Normalize language for Prism
  const normalizedLanguage = language ? language.toLowerCase() : ""
  const prismLanguage =
    normalizedLanguage === "js"
      ? "javascript"
      : normalizedLanguage === "ts"
        ? "typescript"
        : normalizedLanguage === "sh" || normalizedLanguage === "shell"
          ? "bash"
          : normalizedLanguage || "text"

  // Apply Prism highlighting
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, prismLanguage])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Add line numbers and handle line highlighting
  const codeWithLineNumbers = code.split("\n").map((line, i) => {
    const isHighlighted = highlightLines.includes(i + 1)
    return (
      <div
        key={i}
        className={`table-row ${isHighlighted ? "bg-primary/10 -mx-4 px-4" : ""}`}
        data-highlighted={isHighlighted}
      >
        <span className="table-cell pr-4 text-right select-none text-muted-foreground/50 w-10">{i + 1}</span>
        <span className="table-cell">{line || " "}</span>
      </div>
    )
  })

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border bg-card">
      {/* Header with filename and language */}
      <div className="flex items-center justify-between bg-muted px-4 py-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          {filename && <span className="font-medium">{filename}</span>}
          {prismLanguage && <span className="text-xs text-muted-foreground">{prismLanguage}</span>}
        </div>
        <button
          onClick={copyToClipboard}
          className="text-muted-foreground/70 hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* Code content with line numbers */}
      <div className="relative overflow-x-auto p-4 pt-2 text-sm">
        <div className="code-with-line-numbers font-mono leading-relaxed">{codeWithLineNumbers}</div>

        {/* Hidden pre element for Prism to highlight */}
        <pre ref={codeRef} className={`language-${prismLanguage} hidden`}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

