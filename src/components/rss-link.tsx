import Link from "next/link"
import { RssIcon } from "lucide-react"

export default function RssLink() {
  return (
    <Link
      href="/feed.xml"
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      title="RSS Feed"
      target="_blank"
      rel="alternate"
      type="application/rss+xml"
    >
      <RssIcon className="h-5 w-5" />
      <span className="sr-only">RSS Feed</span>
    </Link>
  )
}

