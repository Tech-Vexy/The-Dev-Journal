import { getPostBySlug, getAllPosts } from "@/lib/datocms"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PostContent from "./post-content"
import SyntaxHighlighter from "@/components/syntax-highlighter"
import type { Metadata } from "next"

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteUrl}/posts/${params.slug}`,
      images: [
        {
          url: post.coverImage?.url || `${siteUrl}/og-image.jpg`,
          width: post.coverImage?.width || 1200,
          height: post.coverImage?.height || 630,
          alt: post.coverImage?.alt || post.title,
        },
      ],
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.categories?.map((category: { name: any }) => category.name) || [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage?.url || `${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/posts/${params.slug}`,
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const allPosts = await getAllPosts()

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
      </Link>

      <SyntaxHighlighter>
        <PostContent params={params} post={post} allPosts={allPosts} />
      </SyntaxHighlighter>
    </div>
  )
}

