import webPush from "web-push"

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const privateVapidKey = process.env.VAPID_PRIVATE_KEY
const webPushContact = process.env.NEXT_PUBLIC_SITE_URL

if (!publicVapidKey || !privateVapidKey) {
    console.warn("Web Push requires VAPID keys to be set")
}

webPush.setVapidDetails(webPushContact || "https://localhost:3000", publicVapidKey || "", privateVapidKey || "")

export { webPush }

