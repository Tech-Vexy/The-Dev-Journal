import { NextResponse } from "next/server"
import { getAllConfirmedSubscribers } from "@/lib/newsletter"

export async function GET() {
    try {
        const subscribers = await getAllConfirmedSubscribers()
        return NextResponse.json({ count: subscribers.length })
    } catch (error) {
        console.error("Error getting subscriber count:", error)
        return NextResponse.json({ error: "Failed to get subscriber count" }, { status: 500 })
    }
}

