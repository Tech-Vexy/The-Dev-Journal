import { getAllPosts } from "@/lib/datocms"
import PostCard from "@/components/post-card"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, TrendingUp, BookOpen, Sparkles, Mail, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeaturedPostCard from "@/components/featured-post-card"
import type { Metadata } from "next"
import { generateWebsiteStructuredData } from "@/lib/structured-data"
import Script from "next/script"

export const metadata: Metadata = {
  title: "The Dev Journal - Insights for the Modern Developer",
  description:
    "Cutting-edge tutorials, in-depth articles, and resources for developers building the future of the web.",
  openGraph: {
    title: "The Dev Journal - Insights for the Modern Developer",
    description:
      "Cutting-edge tutorials, in-depth articles, and resources for developers building the future of the web.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "The Dev Journal",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "The Dev Journal - Insights for the Modern Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Dev Journal - Insights for the Modern Developer",
    description:
      "Cutting-edge tutorials, in-depth articles, and resources for developers building the future of the web.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/og-image.jpg`],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    types: {
      "application/rss+xml": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/rss.xml`,
    },
  },
}

export default async function Home() {
  const posts = await getAllPosts()
  const featuredPost = posts[0]
  const regularPosts = posts.slice(1, 4)
  const latestPosts = posts.slice(4, 7)

  // Generate structured data for the website
  const structuredData = generateWebsiteStructuredData()

  return (
    <>
      <Script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <div className="space-y-24 py-12">
               

        {/* Featured Post */}
        {featuredPost && (
          <section className="container mx-auto px-6">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Featured Post</h2>
              </div>
              <Link href="/posts" className="group text-primary hover:text-primary/80 flex items-center font-medium">
                View all posts <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="transform hover:scale-[1.01] transition-all duration-300">
              <FeaturedPostCard post={featuredPost} />
            </div>
          </section>
        )}

        {/* Latest Posts */}
        <section className="container mx-auto px-6">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Latest Articles</h2>
            </div>
            <Link href="/posts" className="group text-primary hover:text-primary/80 flex items-center font-medium">
              View all posts <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post: { id: any; title?: string; slug?: string; excerpt?: string; date?: string; coverImage?: { url: string; alt?: string; width?: number; height?: number }; author?: { name: string; avatar?: string }; content?: { value: any } | undefined; categories?: { id: string; name: string; slug: string }[] | undefined }) => (
              post.title ? 
                <div key={post.id} className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg rounded-xl">
                  <PostCard post={post as { id: string; title: string; slug: string; excerpt: string; date: string; coverImage: { url: string; alt?: string; width?: number; height?: number }; author: { name: string; avatar?: string }; content?: { value: any } | undefined; categories?: { id: string; name: string; slug: string }[] | undefined }} />
                </div> : null
            ))}
          </div>
        </section>

        {/* Become an Author Section */}
        <section className="container mx-auto px-6">
          <div className="rounded-3xl bg-card p-12 md:p-16 border overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="md:max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                    <Edit className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">Join Our Team</span>
                </div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight">Become an Author</h2>
                <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                  Share your knowledge and expertise with our growing community of developers. Join our team of writers
                  and help others learn and grow.
                </p>
                <Button asChild size="lg" className="rounded-full bg-blue-950 px-8">
                  <Link href="/become-author">Get Started</Link>
                </Button>
              </div>
              <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/author.jpg?height=800&width=800"
                  alt="Become an author"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}