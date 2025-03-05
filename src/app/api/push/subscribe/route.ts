import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function POST(request: Request) {
    try {
        const subscription = await request.json()

        // Store subscription in KV store
        const subscriptionId = Math.random().toString(36).substring(2)
        await kv.set(`push:subscription:${subscriptionId}`, JSON.stringify(subscription))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error saving push subscription:", error)
        return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
    }
}

