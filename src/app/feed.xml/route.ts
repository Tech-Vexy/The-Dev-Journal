import { getAllPosts, getPostBySlug } from "@/lib/datocms"
import { NextResponse } from "next/server"
import { render } from "datocms-structured-text-to-html-string"

export async function GET() {
  const posts = await getAllPosts()
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // Create a simple XML feed manually
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Dev Journal</title>
    <link>${siteURL}</link>
    <description>Latest blog posts about web development and technology</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteURL}/rss.xml" rel="self" type="application/rss+xml"/>
`

  // Add items to feed
  for (const post of posts) {
    const fullPost = await getPostBySlug(post.slug)
    if (!fullPost) continue

    // Handle structured text content with blocks
    let content = ""
    if (fullPost.content) {
      try {
        content = render(fullPost.content.value, {
          renderBlock: ({ record }) => {
            if (record.__typename === "ImageBlockRecord") {
              return `<img src="${record.image.url}" alt="${record.image.alt || ""}" />`
            }
            return ""
          },
        })
      } catch (error) {
        console.error(`Error rendering content for post ${post.slug}:`, error)
        content = fullPost.excerpt || ""
      }
    }

    // Escape XML special characters
    const escapeXml = (unsafe: string) => {
      return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case "<":
            return "&lt;"
          case ">":
            return "&gt;"
          case "&":
            return "&amp;"
          case "'":
            return "&apos;"
          case '"':
            return "&quot;"
          default:
            return c
        }
      })
    }

    xml += `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteURL}/posts/${post.slug}</link>
      <guid>${siteURL}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt || "")}</description>
      ${post.author ? `<author>${escapeXml(post.author.name)}</author>` : ""}
      ${post.coverImage?.url ? `<enclosure url="${post.coverImage.url}" type="image/jpeg" />` : ""}
    </item>
`
  }

  xml += `  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}

