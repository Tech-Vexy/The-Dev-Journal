"use server"

export async function sendNotification(title: string, body: string, url: string) {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/push/notify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                body,
                url,
            }),
        })
        return { success: true }
    } catch (error) {
        console.error("Error sending notification:", error)
        return { error: "Failed to send notification" }
    }
}

