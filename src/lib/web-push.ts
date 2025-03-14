import webPush from "web-push"

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const privateVapidKey = process.env.VAPID_PRIVATE_KEY
const webPushContact = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

if (!publicVapidKey || !privateVapidKey) {
  console.warn("Web Push requires VAPID keys to be set")
}

// Initialize web-push with VAPID keys
try {
  webPush.setVapidDetails(webPushContact, publicVapidKey || "", privateVapidKey || "")
} catch (error) {
  console.error("Failed to initialize web-push:", error)
}

export { webPush }

