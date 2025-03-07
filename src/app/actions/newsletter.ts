"use server"

import { revalidatePath } from "next/cache"
import { createContact, getContactByEmail, updateContact, getOrCreateNewsletterList, sendEmail } from "@/lib/brevo"
import { v4 as uuidv4 } from "uuid"

// Subscribe to newsletter
export async function subscribeToNewsletter(email: string) {
    try {
        // Validate email
        if (!email || !email.includes("@")) {
            return { success: false, message: "Please enter a valid email address." }
        }

        // Get the newsletter list ID
        const listId = await getOrCreateNewsletterList()

        // Check if the contact already exists
        const existingContact = await getContactByEmail(email)

        if (existingContact) {
            // Check if already confirmed (subscribed to the newsletter list)
            if (existingContact.listIds?.includes(listId)) {
                return { success: false, message: "You are already subscribed to the newsletter." }
            }

            // Generate a confirmation token
            const confirmationToken = uuidv4()

            // Update the contact with the confirmation token
            await updateContact(email, { CONFIRMATION_TOKEN: confirmationToken, DOUBLE_OPT_IN: "pending" })

            // Send confirmation email
            await sendConfirmationEmail(email, confirmationToken)

            return {
                success: true,
                message: "Please check your email to confirm your subscription.",
            }
        }

        // Create a new contact with pending status
        const confirmationToken = uuidv4()
        await createContact(email, {
            CONFIRMATION_TOKEN: confirmationToken,
            DOUBLE_OPT_IN: "pending",
        })

        // Send confirmation email
        await sendConfirmationEmail(email, confirmationToken)

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

// Confirm newsletter subscription
export async function confirmNewsletterSubscription(token: string) {
    try {
        if (!token) {
            return { success: false, message: "Invalid confirmation token." }
        }

        // Get the newsletter list ID
        const listId = await getOrCreateNewsletterList()

        // Find the contact with this confirmation token
        // This requires a workaround since Brevo doesn't support searching by attributes
        // In a production app, you might want to use a database to store tokens

        // For this demo, we'll assume the token is valid and the user provides their email
        // In a real app, you'd store the token-to-email mapping in a database

        // For the purpose of this demo, we'll extract the email from the token
        // This is just a placeholder - in a real app, you'd use a proper lookup
        const email = token.split("-").pop() // This is just a placeholder

        if (!email) {
            return { success: false, message: "Invalid confirmation token." }
        }

        const contact = await getContactByEmail(email)

        if (!contact) {
            return { success: false, message: "Contact not found." }
        }

        // Verify the token matches
        if (contact.attributes?.CONFIRMATION_TOKEN !== token) {
            return { success: false, message: "Invalid confirmation token." }
        }

        // Update the contact to add them to the newsletter list and mark as confirmed
        await updateContact(
            email,
            {
                DOUBLE_OPT_IN: "confirmed",
                CONFIRMATION_TOKEN: null,
            },
            [...(contact.listIds || []), listId],
        )

        // Send welcome email
        await sendWelcomeEmail(email)

        return { success: true, message: "Your subscription has been confirmed!" }
    } catch (error: any) {
        console.error("Error confirming newsletter subscription:", error)
        return { success: false, message: error.message || "Failed to confirm newsletter subscription." }
    } finally {
        revalidatePath("/")
    }
}

// Unsubscribe from newsletter
export async function unsubscribeFromNewsletter(email: string) {
    try {
        if (!email) {
            return { success: false, message: "Email is required." }
        }

        // Get the newsletter list ID
        const listId = await getOrCreateNewsletterList()

        // Get the contact
        const contact = await getContactByEmail(email)

        if (!contact) {
            return { success: false, message: "You are not subscribed to the newsletter." }
        }

        // Remove the contact from the newsletter list
        const updatedListIds = (contact.listIds || []).filter((id) => id !== listId)
        await updateContact(email, {}, updatedListIds)

        return { success: true, message: "You have been successfully unsubscribed." }
    } catch (error: any) {
        console.error("Error unsubscribing from newsletter:", error)
        return { success: false, message: error.message || "Failed to unsubscribe from newsletter." }
    } finally {
        revalidatePath("/")
    }
}

// Send newsletter to all subscribers
export async function sendNewsletter(formData: FormData) {
    const subject = formData.get("subject") as string
    const content = formData.get("content") as string

    if (!subject || !content) {
        return { success: false, message: "Subject and content are required." }
    }

    try {
        // Get the newsletter list ID
        const listId = await getOrCreateNewsletterList()

        // In a real implementation, you would use Brevo's campaign API to send to a list
        // For this demo, we'll use a simplified approach

        // Send the newsletter using Brevo's API
        await sendEmail({
            to: [{ email: "newsletter@example.com" }], // This would be replaced with actual subscribers
            subject,
            htmlContent: content,
        })

        return { success: true, message: "Newsletter sent successfully!" }
    } catch (error: any) {
        console.error("Error sending newsletter:", error)
        return { success: false, message: error.message || "Failed to send newsletter." }
    } finally {
        revalidatePath("/admin/newsletter")
    }
}

// Helper functions for sending specific emails
async function sendConfirmationEmail(email: string, token: string): Promise<void> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const confirmUrl = `${siteUrl}/newsletter/confirm?token=${token}&email=${encodeURIComponent(email)}`

    await sendEmail({
        to: [{ email }],
        subject: "Confirm your DevBlog newsletter subscription",
        htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${siteUrl}/logo.svg" alt="DevBlog Logo" style="width: 50px; height: 50px;">
          <h2 style="color: #4F46E5;">Confirm your subscription</h2>
        </div>
        
        <p>Hello,</p>
        
        <p>Thank you for subscribing to the DevBlog newsletter! To complete your subscription and start receiving our latest articles and updates, please confirm your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirm Subscription</a>
        </div>
        
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 14px;">${confirmUrl}</p>
        
        <p>If you didn't request this subscription, you can safely ignore this email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} DevBlog. All rights reserved.</p>
        </div>
      </div>
    `,
    })
}

async function sendWelcomeEmail(email: string): Promise<void> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`

    await sendEmail({
        to: [{ email }],
        subject: "Welcome to the DevBlog Newsletter!",
        htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${siteUrl}/logo.svg" alt="DevBlog Logo" style="width: 50px; height: 50px;">
          <h2 style="color: #4F46E5;">Welcome to DevBlog!</h2>
        </div>
        
        <p>Hello,</p>
        
        <p>Thank you for confirming your subscription to the DevBlog newsletter. You're now officially part of our community!</p>
        
        <p>Here's what you can expect:</p>
        <ul>
          <li>Weekly articles on web development best practices</li>
          <li>Tutorials on the latest frameworks and technologies</li>
          <li>Tips and tricks to improve your coding skills</li>
          <li>Exclusive content only available to subscribers</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Visit Our Blog</a>
        </div>
        
        <p>If you ever want to unsubscribe, you can <a href="${unsubscribeUrl}" style="color: #4F46E5;">click here</a>.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} The Dev Journal. All rights reserved.</p>
        </div>
      </div>
    `,
    })
}

