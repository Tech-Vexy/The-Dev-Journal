import { getPostBySlug, getAllPosts } from "@/lib/datocms"
import { getComments } from "@/lib/comments"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PostContent from "./post-content"

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const comments = await getComments(params.slug)
  const allPosts = await getAllPosts()

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
      </Link>

      <PostContent params={params} post={post} comments={comments} allPosts={allPosts} />
    </div>
  )
}

