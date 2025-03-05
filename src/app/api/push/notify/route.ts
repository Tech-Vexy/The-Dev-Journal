import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { webPush } from "@/lib/web-push"

export async function POST(request: Request) {
    try {
        const { title, body, url } = await request.json()

        // Get all subscriptions
        const subscriptionKeys = await kv.keys("push:subscription:*")
        const subscriptions = await Promise.all(
            subscriptionKeys.map(async (key) => {
                const sub = await kv.get(key)
                return JSON.parse(sub as string)
            }),
        )

        // Send notifications to all subscriptions
        await Promise.all(
            subscriptions.map(async (subscription) => {
                try {
                    await webPush.sendNotification(
                        subscription,
                        JSON.stringify({
                            title,
                            body,
                            url,
                        }),
                    )
                } catch (error) {
                    console.error("Error sending notification:", error)
                    // Remove invalid subscriptions
                    if (error.statusCode === 410) {
                        const key = subscriptionKeys.find((key) => JSON.parse(kv.get(key) as string) === subscription)
                        if (key) {
                            await kv.del(key)
                        }
                    }
                }
            }),
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error sending push notifications:", error)
        return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
    }
}

