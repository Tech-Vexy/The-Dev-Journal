import { getAllPosts } from "@/lib/datocms"
import PostCard from "@/components/post-card"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Clock, ChevronRight } from "lucide-react"
import { calculateReadingTime } from "@/lib/reading-time"
import { Button } from "@/components/ui/button"

export default async function Home() {
    const posts = await getAllPosts()
    const featuredPost = posts[0]
    const regularPosts = posts.slice(1)

    return (
        <div className="space-y-12 py-6">
            {/* Hero Section */}
            <section className="text-center py-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    The Dev Jounal
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                   Discover Cutting-edge tutorials, insights, and resources for modern software developers.
                </p>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section>
                    <div className="featured-post h-[500px]">
                        <Image
                            src={featuredPost.coverImage?.url || "/placeholder.svg?height=800&width=1400"}
                            alt={featuredPost.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 1200px"
                            priority
                        />
                        <div className="featured-post-overlay"></div>
                        <div className="featured-post-content">
                            <div className="flex items-center gap-4 mb-3">
                                <span className="tag">Featured</span>
                                <span className="text-sm text-white/80">{format(new Date(featuredPost.date), "MMMM d, yyyy")}</span>
                                <span className="flex items-center text-sm text-white/80">
                  <Clock className="h-3 w-3 mr-1" />
                                    {calculateReadingTime(featuredPost.content?.value || "")} min read
                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                                <Link href={`/posts/${featuredPost.slug}`} className="hover:underline">
                                    {featuredPost.title}
                                </Link>
                            </h2>
                            <p className="text-white/90 text-lg mb-4 line-clamp-2">{featuredPost.excerpt}</p>
                            <div className="flex items-center">
                                <Button asChild variant="default" className="group">
                                    <Link href={`/posts/${featuredPost.slug}`}>
                                        Read More <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Posts */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">Latest Posts</h2>
                    <Link href="/posts" className="text-primary hover:text-primary/80 flex items-center">
                        View all posts <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {regularPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-accent/5 p-8 rounded-2xl">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-muted-foreground mb-6">
                        Get the latest articles, tutorials, and updates delivered straight to your inbox.
                    </p>
                    <form className="flex gap-2 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 h-10 min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            required
                        />
                        <Button type="submit">Subscribe</Button>
                    </form>
                </div>
            </section>
        </div>
    )
}

