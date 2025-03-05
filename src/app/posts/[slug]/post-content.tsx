"use client"

import Image from "next/image"
import { format } from "date-fns"
import { StructuredText, renderNodeRule } from "react-datocms"
import { isHeading, isParagraph, isCode } from "datocms-structured-text-utils"
import CommentForm from "@/components/comment-form"
import CommentsList from "@/components/comments-list"
import { Separator } from "@/components/ui/separator"
import RssLink from "@/components/rss-link"
import ShareButtons from "@/components/share-buttons"
import TableOfContents from "@/components/table-of-contents"
import NewsletterForm from "@/components/newsletter-form"
import RelatedPosts from "@/components/related-posts"
import ReadingProgress from "@/components/reading-progress"
import PostNavigation from "@/components/post-navigation"
import CopyButton from "@/components/copy-button"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import { calculateReadingTime } from "@/lib/reading-time"
import { Clock, Eye } from "lucide-react"
import { useViews } from "@/hooks/use-views"
import type { Comment } from "@/lib/comments"
import type { Post } from "@/types/posts"
import type { JSX } from "react"

interface PostContentProps {
    params: { slug: string }
    post: Post
    comments: Comment[]
    allPosts: Post[]
}

export default function PostContent({ params, post, comments, allPosts }: PostContentProps) {
    const views = useViews(params.slug)
    const readingTime = calculateReadingTime(post.content?.value || "")
    const currentPostIndex = allPosts.findIndex((p) => p.slug === params.slug)
    const prevPost = currentPostIndex < allPosts.length - 1 ? allPosts[currentPostIndex + 1] : undefined
    const nextPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : undefined
    const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`

    return (
        <>
            <ReadingProgress />
            <KeyboardShortcuts />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-8">
                    {/* Left Sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-8">
                            <TableOfContents content={post.content} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <article className="max-w-3xl">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-4xl font-bold">{post.title}</h1>
                                <RssLink />
                            </div>
                            <div className="flex items-center text-muted-foreground mb-6">
                                <time dateTime={post.date}>{format(new Date(post.date), "MMMM d, yyyy")}</time>
                                <span className="mx-2">•</span>
                                <span>{post.author.name}</span>
                                <span className="mx-2">•</span>
                                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                                    {readingTime} min read
                </span>
                                {views !== null && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                                            {views} views
                    </span>
                                    </>
                                )}
                            </div>

                            {post.coverImage && (
                                <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
                                    <Image
                                        src={post.coverImage.url || "/placeholder.svg"}
                                        alt={post.coverImage.alt || post.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}
                        </div>

                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            {post.content && (
                                <StructuredText
                                    data={post.content}
                                    renderBlock={({ record }) => {
                                        if (record.__typename === "ImageBlockRecord") {
                                            return (
                                                <div className="my-8">
                                                    <Image
                                                        src={record.image.url || "/placeholder.svg"}
                                                        alt={record.image.alt || ""}
                                                        width={record.image.width || 800}
                                                        height={record.image.height || 450}
                                                        className="rounded-lg"
                                                    />
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                    customNodeRules={[
                                        renderNodeRule(isHeading, ({ node, children, key }) => {
                                            const Tag = `h${node.level}` as keyof JSX.IntrinsicElements
                                            const id = children?.toString().toLowerCase().replace(/\s+/g, "-")
                                            return (
                                                <Tag key={key} id={id}>
                                                    {children}
                                                </Tag>
                                            )
                                        }),
                                        renderNodeRule(isParagraph, ({ children, key }) => {
                                            return <p key={key}>{children}</p>
                                        }),
                                        renderNodeRule(isCode, ({ node, key }) => {
                                            return (
                                                <div className="relative" key={key}>
                          <pre className="relative">
                            <code>{node.code}</code>
                          </pre>
                                                    <CopyButton text={node.code} />
                                                </div>
                                            )
                                        }),
                                    ]}
                                />
                            )}
                        </div>

                        <div className="mt-8">
                            <ShareButtons title={post.title} url={url} />
                        </div>

                        <Separator className="my-12" />

                        <PostNavigation prevPost={prevPost} nextPost={nextPost} />

                        <Separator className="my-12" />

                        <RelatedPosts posts={relatedPosts} />

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold mb-6">Comments</h2>
                            <div className="space-y-8">
                                <CommentsList comments={comments} />
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
                                    <CommentForm postSlug={params.slug} />
                                </div>
                            </div>
                        </section>
                    </article>

                    {/* Right Sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-8 space-y-8">
                            <NewsletterForm />
                        </div>
                    </aside>
                </div>
            </div>
        </>
    )
}

