import { getAllPosts } from "@/lib/datocms"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getAllPosts()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const postUrls = posts.map((post) => ({
        url: `${siteUrl}/posts/${post.slug}`,
        lastModified: new Date(post.date),
    }))

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
        },
        {
            url: `${siteUrl}/about`,
            lastModified: new Date(),
        },
        ...postUrls,
    ]
}

