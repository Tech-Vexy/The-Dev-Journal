import { getAllPosts } from "@/lib/datocms";
import PostCard from "@/components/post-card";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, ChevronRight } from "lucide-react";
import { calculateReadingTime } from "@/lib/reading-time";
import { Button } from "@/components/ui/button";
import NewsletterForm from "@/components/newsletter-form";
import { Suspense } from "react";

export default async function Home() {
    const posts = await getAllPosts();

    // Handle edge cases where posts might be empty
    if (!posts.length) {
        return <EmptyState />;
    }

    const featuredPost = posts[0];
    const regularPosts = posts.slice(1, 7); // Limit to 6 regular posts for better performance

    return (
        <main className="space-y-16 py-8">
            {/* Hero Section */}
            <section className="text-center py-2S">
                <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-clip-text text-blue-950 bg-gradient-to-r from-primary to-accent">
                    The Dev Journal
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Cutting-edge tutorials, insights, and resources for Modern Software Developers.
                </p>
            </section>

            {/* Featured Post */}
            <FeaturedPost post={featuredPost} />

            {/* Latest Posts */}
            <LatestPosts posts={regularPosts} />

            {/* Newsletter Section */}
            <NewsletterSection />
        </main>
    );
}

// Component for featured post section
function FeaturedPost({ post }) {
    if (!post) return null;

    return (
        <section>
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <Image
                    src={post.coverImage?.url || "/placeholder.svg?height=800&width=1400"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-700"
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              Featured
            </span>
                        <span className="text-sm text-white/80">
              {format(new Date(post.date), "MMMM d, yyyy")}
            </span>
                        <span className="flex items-center text-sm text-white/80">
              <Clock className="h-3 w-3 mr-1" />
                            {calculateReadingTime(post.content?.value || "")} min read
            </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                        <Link href={`/posts/${post.slug}`} className="hover:underline">
                            {post.title}
                        </Link>
                    </h2>
                    <p className="text-white/90 text-lg mb-6 line-clamp-2 max-w-3xl">
                        {post.excerpt}
                    </p>
                    <Button asChild variant="default" size="lg" className="group">
                        <Link href={`/posts/${post.slug}`}>
                            Read More{" "}
                            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

// Component for latest posts section
function LatestPosts({ posts }) {
    if (!posts.length) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Latest Posts</h2>
                <Link
                    href="/posts"
                    className="text-primary hover:text-primary/80 flex items-center group"
                >
                    View all posts{" "}
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Suspense fallback={<PostsLoadingSkeleton count={6} />}>
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </Suspense>
            </div>
        </section>
    );
}

// Component for newsletter section
function NewsletterSection() {
    return (
        <section className="bg-accent/5 p-8 md:p-12 rounded-2xl">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-muted-foreground">
                        Get the latest articles, tutorials, and updates delivered straight to
                        your inbox.
                    </p>
                </div>
                <div className="max-w-md mx-auto">
                    <NewsletterForm />
                </div>
            </div>
        </section>
    );
}

// Empty state when no posts are available
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">No posts available yet</h2>
            <p className="text-muted-foreground mb-6">
                Check back soon for new content!
            </p>
            <NewsletterSection />
        </div>
    );
}

// Loading skeleton for posts
function PostsLoadingSkeleton({ count = 3 }) {
    return (
        <>
            {Array(count)
                .fill(null)
                .map((_, i) => (
                    <div
                        key={i}
                        className="rounded-lg overflow-hidden border border-border animate-pulse"
                    >
                        <div className="h-48 bg-muted"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-6 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                            <div className="h-4 bg-muted rounded w-full"></div>
                            <div className="h-4 bg-muted rounded w-full"></div>
                        </div>
                    </div>
                ))}
        </>
    );
}