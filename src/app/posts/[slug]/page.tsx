import { getPostBySlug, getAllPosts } from "@/lib/datocms"
import { getComments } from "@/lib/comments"
import { notFound } from "next/navigation"
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
import { calculateReadingTime } from "@/lib/reading-time"
import { ArrowLeft, Clock, Calendar, User } from "lucide-react"
import Link from "next/link"
import CopyButton from "@/components/copy-button"
import CategoryBadge from "@/components/category-badge"
import AuthorProfile from "@/components/author-profile"

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

  const readingTime = calculateReadingTime(post.content?.value || "")
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`

  return (
      <>
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to blog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-8">
            {/* Left Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents />
              </div>
            </aside>

            {/* Main Content */}
            <article className="max-w-3xl">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <time dateTime={post.date}>{format(new Date(post.date), "MMMM d, yyyy")}</time>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>

                {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.categories.map((category) => (
                          <CategoryBadge key={category.id} category={category} />
                      ))}
                    </div>
                )}

                {post.coverImage && (
                    <div className="relative aspect-[2/1] mb-8 overflow-hidden rounded-xl">
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

              <div className="prose prose-lg dark:prose-invert">
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
                                <Tag key={key} id={id} className="scroll-mt-24">
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
                          <pre>
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

              <div className="mt-8 flex justify-between items-center">
                <ShareButtons title={post.title} url={url} />
                <RssLink />
              </div>

              <Separator className="my-12" />

              {/* Author Profile */}
              <section className="mt-12 mb-12">
                <h2 className="text-2xl font-bold mb-6">About the Author</h2>
                <AuthorProfile author={post.author} />
              </section>

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
              <div className="sticky top-24 space-y-8">
                <NewsletterForm />
              </div>
            </aside>
          </div>
        </div>
      </>
  )
}

