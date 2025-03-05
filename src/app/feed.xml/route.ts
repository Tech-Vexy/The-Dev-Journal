import { getAllPosts, getPostBySlug } from "@/lib/datocms"
import { Feed } from "feed"
import { NextResponse } from "next/server"
import { render } from "datocms-structured-text-to-html-string"

export async function GET() {
  try {
    const posts = await getAllPosts()
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    if (!posts || posts.length === 0) {
      return new NextResponse("No posts found", { status: 404 })
    }

    const feed = new Feed({
      title: "The Dev Journal",
      description: "Latest blog posts about web development and technology",
      id: siteURL,
      link: siteURL,
      language: "en",
      favicon: `${siteURL}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}`,
      updated: posts[0] ? new Date(posts[0].date) : new Date(),
      generator: "Feed for The Dev Journal",
      feedLinks: {
        rss2: `${siteURL}/feed.xml`,
        json: `${siteURL}/feed.json`,
        atom: `${siteURL}/feed.atom`,
      },
      author: {
        name: "Veldrine Evelia Kaharwa",
        email: "eveliaveldrine@outlook.com",
        link: siteURL,
      },
    })

    for (const post of posts) {
      try {
        const fullPost = await getPostBySlug(post.slug)
        const content = fullPost.content ? render(fullPost.content.value) : ""

        feed.addItem({
          title: post.title,
          id: `${siteURL}/posts/${post.slug}`,
          link: `${siteURL}/posts/${post.slug}`,
          description: post.excerpt,
          content: content,
          date: new Date(post.date),
          author: [
            {
              name: post.author.name,
            },
          ],
          category: post.categories?.map((category) => ({
            name: category.name,
          })),
          image: post.coverImage?.url,
        })
      } catch (postError) {
        console.error(`Error processing post ${post.slug}:`, postError)
        // Optionally, you could choose to skip this post or handle differently
      }
    }

    return new NextResponse(feed.rss2(), {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    return new NextResponse("Error generating RSS feed", { status: 500 })
  }
}