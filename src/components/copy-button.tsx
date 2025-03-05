"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CopyButtonProps {
    text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
    const [isCopied, setIsCopied] = useState(false)

    const copy = async () => {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 bg-background/20 hover:bg-background/30 text-white h-8 w-8"
            onClick={copy}
        >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy code</span>
        </Button>
    )
}

