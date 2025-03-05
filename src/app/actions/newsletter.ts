"use server"

import { revalidatePath } from "next/cache"
import { addSubscriber, confirmSubscriber, removeSubscriber, getSubscriberByEmail } from "@/lib/newsletter"
import { sendConfirmationEmail, sendWelcomeEmail, sendNewsletterEmail } from "@/lib/email"

export async function subscribeToNewsletter(email: string) {
    try {
        // Validate email
        if (!email || !email.includes("@")) {
            return { success: false, message: "Please enter a valid email address." }
        }

        const existingSubscriber = await getSubscriberByEmail(email)
        if (existingSubscriber) {
            if (existingSubscriber.confirmed) {
                return { success: false, message: "You are already subscribed to the newsletter." }
            } else {
                // Resend confirmation email
                await sendConfirmationEmail(existingSubscriber)
                return {
                    success: true,
                    message: "A confirmation email has been sent. Please check your inbox.",
                }
            }
        }

        // Add new subscriber
        const subscriber = await addSubscriber(email)

        if (!subscriber) {
            return { success: false, message: "Failed to subscribe. Please try again." }
        }

        // Send confirmation email
        await sendConfirmationEmail(subscriber)

        return {
            success: true,
            message: "Please check your email to confirm your subscription.",
        }
    } catch (error: any) {
        console.error("Error subscribing to newsletter:", error)
        return { success: false, message: error.message || "Failed to subscribe to newsletter." }
    } finally {
        revalidatePath("/")
    }
}

export async function confirmNewsletterSubscription(token: string) {
    try {
        const subscriber = await confirmSubscriber(token)

        if (!subscriber) {
            return { success: false, message: "Invalid or expired confirmation link." }
        }

        // Send welcome email after successful confirmation
        await sendWelcomeEmail(subscriber)

        return { success: true, message: "Your subscription has been confirmed!" }
    } catch (error: any) {
        console.error("Error confirming newsletter subscription:", error)
        return { success: false, message: error.message || "Failed to confirm newsletter subscription." }
    } finally {
        revalidatePath("/")
    }
}

export async function unsubscribeFromNewsletter(id: string) {
    try {
        const success = await removeSubscriber(id)

        if (!success) {
            return { success: false, message: "Invalid unsubscribe link." }
        }

        return { success: true, message: "You have been successfully unsubscribed." }
    } catch (error: any) {
        console.error("Error unsubscribing from newsletter:", error)
        return { success: false, message: error.message || "Failed to unsubscribe from newsletter." }
    } finally {
        revalidatePath("/")
    }
}

export async function sendNewsletter(formData: FormData) {
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string

    if (!subject || !content) {
        return { success: false, message: "Subject and content are required." }
    }

    try {
        await sendNewsletterEmail(subject, content)
        return { success: true, message: "Newsletter sent successfully!" }
    } catch (error: any) {
        console.error("Error sending newsletter:", error)
        return { success: false, message: error.message || "Failed to send newsletter." }
    } finally {
        revalidatePath("/admin/newsletter")
    }
}
