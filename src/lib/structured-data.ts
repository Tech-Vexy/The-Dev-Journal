import type { Post } from "@/types/post"

export function generatePostStructuredData(post: Post, url: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const postUrl = `${siteUrl}${url}`

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url || `${siteUrl}/og-image.jpg`,
    datePublished: post.date,
    dateModified: post.date, // Use actual modified date if available
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.website || undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "DevBlog",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    url: postUrl,
  }

  return JSON.stringify(structuredData)
}

export function generateWebsiteStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DevBlog",
    description: "Cutting-edge tutorials, insights, and resources for modern web developers.",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return JSON.stringify(structuredData)
}

