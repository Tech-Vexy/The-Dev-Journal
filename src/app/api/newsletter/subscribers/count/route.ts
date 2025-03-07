import { NextResponse } from "next/server"
import { getOrCreateNewsletterList, getSubscribersCount } from "@/lib/brevo"

export async function GET() {
    try {
        const listId = await getOrCreateNewsletterList()
        const count = await getSubscribersCount(listId)
        return NextResponse.json({ count })
    } catch (error) {
        console.error("Error getting subscriber count:", error)
        return NextResponse.json({ error: "Failed to get subscriber count", count: 0 }, { status: 500 })
    }
}

