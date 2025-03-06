import webPush from "web-push";

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

// Use a mailto: URL instead of http://localhost
const webPushContact = process.env.VAPID_CONTACT_EMAIL 
  ? `mailto:${process.env.VAPID_CONTACT_EMAIL}` 
  : "mailto:TheDevJournal@protonmail.com";

if (!publicVapidKey || !privateVapidKey) {
    console.warn("Web Push requires VAPID keys to be set");
}

webPush.setVapidDetails(webPushContact, publicVapidKey || "", privateVapidKey || "");

export { webPush };
