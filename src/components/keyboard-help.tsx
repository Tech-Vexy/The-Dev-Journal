"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Keyboard } from "lucide-react"

const shortcuts = [
  { key: "h", description: "Go to home page" },
  { key: "k", description: "Open search" },
  { key: "← + Alt", description: "Previous post" },
  { key: "→ + Alt", description: "Next post" },
  { key: "/", description: "Focus search" },
]

export default function KeyboardHelp() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Keyboard className="h-4 w-4" />
          <span className="sr-only">Keyboard shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Use these keyboard shortcuts to quickly navigate the site.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {shortcuts.map(({ key, description }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{description}</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted rounded">{key}</kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

