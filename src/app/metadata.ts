import type { Metadata } from "next"

interface MetadataProps {
    title?: string
    description?: string
    image?: string
    type?: string
    author?: string
    publishedTime?: string
}

export function generateMetadata({
                                     title,
                                     description,
                                     image,
                                     type = "website",
                                     author,
                                     publishedTime,
                                 }: MetadataProps): Metadata {
    const siteName = "My Blog"
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const metadata: Metadata = {
        title: title ? `${title} | ${siteName}` : siteName,
        description: description || "A blog about web development, design, and technology",
        openGraph: {
            title: title || siteName,
            description: description || "A blog about web development, design, and technology",
            url: siteUrl,
            siteName,
            type,
            ...(image && {
                images: [
                    {
                        url: image,
                        width: 1200,
                        height: 630,
                        alt: title || siteName,
                    },
                ],
            }),
            ...(publishedTime && { publishedTime }),
        },
        twitter: {
            card: "summary_large_image",
            title: title || siteName,
            description: description || "A blog about web development, design, and technology",
            ...(image && { images: [image] }),
        },
        authors: author ? [{ name: author }] : undefined,
    }

    return metadata
}

