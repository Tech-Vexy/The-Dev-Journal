import { type NextRequest, NextResponse } from "next/server"
import { incrementViewCount, getViewCount } from "@/lib/views"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")

    if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    try {
        const views = await getViewCount(slug)
        return NextResponse.json({ views })
    } catch (error) {
        return NextResponse.json({ error: "Failed to get views" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")

    if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    try {
        const views = await incrementViewCount(slug)
        return NextResponse.json({ views })
    } catch (error) {
        return NextResponse.json({ error: "Failed to increment views" }, { status: 500 })
    }
}

