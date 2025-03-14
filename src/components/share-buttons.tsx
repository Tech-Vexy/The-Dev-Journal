"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, LinkIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ShareButtonsProps {
  title: string
  url: string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const { toast } = useToast()

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(shareLinks.twitter, "_blank")}
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(shareLinks.facebook, "_blank")}
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(shareLinks.linkedin, "_blank")}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy link">
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

