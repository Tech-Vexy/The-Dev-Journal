"use client"

import Head from "next/head"
import { useRouter } from "next/router"

interface SEOProps {
  title?: string
  description?: string
  image?: string
  article?: boolean
  publishedTime?: string
  modifiedTime?: string
  author?: string
  canonicalUrl?: string
}

export default function SEO({
  title,
  description,
  image,
  article = false,
  publishedTime,
  modifiedTime,
  author,
  canonicalUrl,
}: SEOProps) {
  const router = useRouter()

  const siteTitle = "DevBlog"
  const siteDescription = "Cutting-edge tutorials, insights, and resources for modern web developers."
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const seoTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const seoDescription = description || siteDescription
  const seoImage = image || `${siteUrl}/og-image.jpg`
  const url = canonicalUrl || `${siteUrl}${router.asPath}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Article specific tags */}
      {article && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {article && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {article && author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Head>
  )
}

