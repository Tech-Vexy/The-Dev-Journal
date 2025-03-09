import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

// Secret token to prevent unauthorized revalidation requests
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    
    // Verify the secret token
    const secret = request.headers.get("x-revalidation-secret")
    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: "Invalid revalidation secret" },
        { status: 401 }
      )
    }

    // Extract information about what changed
    const { entity, event } = body
    
    // Determine which paths to revalidate based on the entity type
    if (entity.type === "item") {
      const model = entity.attributes?.model_id
      
      // Revalidate specific paths based on the model type
      if (model === "post") {
        // Revalidate the posts tag and homepage
        revalidateTag("posts")
        revalidatePath("/")
        revalidatePath("/posts")
        
        // If we have the slug, revalidate the specific post page
        if (entity.attributes?.slug) {
          revalidatePath(`/posts/${entity.attributes.slug}`)
        } else {
          // If no slug, revalidate all post pages to be safe
          revalidatePath("/posts/[slug]")
        }
      } else if (model === "category") {
        // Revalidate category-related pages
        revalidateTag("categories")
        revalidatePath("/categories")
        
        if (entity.attributes?.slug) {
          revalidatePath(`/categories/${entity.attributes.slug}`)
        } else {
          revalidatePath("/categories/[slug]")
        }
      } else if (model === "author") {
        // Revalidate author-related content
        revalidateTag("authors")
        // Authors appear on post pages, so revalidate those
        revalidatePath("/posts/[slug]")
      }
    }

    // Revalidate the sitemap and RSS feed
    revalidatePath("/sitemap.xml")
    revalidatePath("/feed.xml")

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err: any) {
    // If there's an error, return a 500 response
    return NextResponse.json(
      { message: "Error revalidating", error: err.message },
      { status: 500 }
    )
  }
}
