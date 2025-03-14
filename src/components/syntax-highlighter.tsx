"use client"

import type React from "react"

interface SyntaxHighlighterProps {
  children: React.ReactNode
}

export default function SyntaxHighlighter({ children }: SyntaxHighlighterProps) {
  return <div className="syntax-highlighter">{children}</div>
}

