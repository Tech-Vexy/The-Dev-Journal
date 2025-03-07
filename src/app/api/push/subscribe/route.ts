import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const subscription = await request.json()

        // In a production app, you would store this subscription
        // For now, we'll just return success
        console.log("Push subscription received:", subscription)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error saving push subscription:", error)
        return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
    }
}

