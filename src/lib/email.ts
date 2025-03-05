"use server"

import type { Subscriber } from "./newsletter"

// Brevo API base URL
const BREVO_API_URL = "https://api.brevo.com/v3"

// Helper function to send emails via Brevo API
async function sendEmail({
                             to,
                             subject,
                             htmlContent,
                             sender = { name: "DevBlog", email: "newsletter@devblog.com" },
                         }: {
    to: { email: string; name?: string }[]
    subject: string
    htmlContent: string
    sender?: { name: string; email: string }
}) {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY || "",
        },
        body: JSON.stringify({
            sender,
            to,
            subject,
            htmlContent,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(`Failed to send email: ${error.message || "Unknown error"}`)
    }

    return await response.json()
}

// Send confirmation email
export async function sendConfirmationEmail(subscriber: Subscriber): Promise<void> {
    if (!subscriber.confirmationToken) {
        throw new Error("Subscriber has no confirmation token")
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const confirmUrl = `${siteUrl}/newsletter/confirm?token=${subscriber.confirmationToken}`

    await sendEmail({
        to: [{ email: subscriber.email }],
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

// Send welcome email
export async function sendWelcomeEmail(subscriber: Subscriber): Promise<void> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?id=${subscriber.id}`

    await sendEmail({
        to: [{ email: subscriber.email }],
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
          <p>© ${new Date().getFullYear()} DevBlog. All rights reserved.</p>
        </div>
      </div>
    `,
    })
}

// Send newsletter to all confirmed subscribers
export async function sendNewsletterEmail(subject: string, content: string): Promise<void> {
    const subscribers = await getAllConfirmedSubscribers()

    if (subscribers.length === 0) {
        throw new Error("No confirmed subscribers found")
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Prepare recipients
    const to = subscribers.map((subscriber) => ({
        email: subscriber.email,
        // Add unsubscribe URL as a custom field for each recipient
        params: {
            UNSUBSCRIBE_URL: `${siteUrl}/newsletter/unsubscribe?id=${subscriber.id}`,
        },
    }))

    // Add unsubscribe link to the content
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${siteUrl}/logo.svg" alt="DevBlog Logo" style="width: 50px; height: 50px;">
      </div>
      
      ${content}
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666;">
        <p>You're receiving this email because you subscribed to the DevBlog newsletter.</p>
        <p><a href="{{ params.UNSUBSCRIBE_URL }}" style="color: #4F46E5;">Unsubscribe</a></p>
        <p>© ${new Date().getFullYear()} DevBlog. All rights reserved.</p>
      </div>
    </div>
  `

    await sendEmail({
        to,
        subject,
        htmlContent,
    })
}

// Import this function from newsletter.ts to avoid circular dependencies
import { getAllConfirmedSubscribers } from "./newsletter"

