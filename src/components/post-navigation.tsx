import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PostNavigationProps {
    prevPost?: {
        title: string
        slug: string
    }
    nextPost?: {
        title: string
        slug: string
    }
}

export default function PostNavigation({ prevPost, nextPost }: PostNavigationProps) {
    return (
        <div className="flex justify-between items-center mt-8">
            {prevPost ? (
                <div data-prev-post className="flex-1">
                    <Button variant="ghost" className="flex items-center gap-2" asChild>
                        <Link href={`/posts/${prevPost.slug}`}>
                            <ArrowLeft className="h-4 w-4" />
                            <span className="line-clamp-1">{prevPost.title}</span>
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="flex-1" />
            )}

            {nextPost ? (
                <div data-next-post className="flex-1 text-right">
                    <Button variant="ghost" className="flex items-center gap-2 ml-auto" asChild>
                        <Link href={`/posts/${nextPost.slug}`}>
                            <span className="line-clamp-1">{nextPost.title}</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="flex-1" />
            )}
        </div>
    )
}

