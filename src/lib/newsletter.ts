"use server"

import { kv } from "@vercel/kv"
import { v4 as uuidv4 } from "uuid"

export type Subscriber = {
    id: string
    email: string
    confirmed: boolean
    confirmationToken?: string
    createdAt: string
    updatedAt: string
}

const SUBSCRIBERS_PREFIX = "newsletter:subscribers"
const TOKENS_PREFIX = "newsletter:tokens"
const EMAIL_INDEX_PREFIX = "newsletter:email-index"

// Helper to generate a confirmation token without using crypto
function generateToken(email: string): string {
    // Create a unique token using UUID and timestamp
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 15)
    const emailHash = Buffer.from(email).toString("base64")

    return `${timestamp}-${random}-${emailHash}`.replace(/[^a-zA-Z0-9]/g, "")
}

// Add a new subscriber
export async function addSubscriber(email: string): Promise<Subscriber | null> {
    // Check if email already exists
    const existingSubscriber = await getSubscriberByEmail(email)

    if (existingSubscriber) {
        if (existingSubscriber.confirmed) {
            // Already subscribed
            return null
        } else {
            // Resend confirmation
            const token = generateToken(email)
            const updatedSubscriber = {
                ...existingSubscriber,
                confirmationToken: token,
                updatedAt: new Date().toISOString(),
            }

            await kv.set(`${SUBSCRIBERS_PREFIX}:${existingSubscriber.id}`, JSON.stringify(updatedSubscriber))
            await kv.set(`${TOKENS_PREFIX}:${token}`, existingSubscriber.id)

            return updatedSubscriber
        }
    }

    // Create new subscriber
    const id = uuidv4()
    const token = generateToken(email)

    const subscriber: Subscriber = {
        id,
        email,
        confirmed: false,
        confirmationToken: token,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    await kv.set(`${SUBSCRIBERS_PREFIX}:${id}`, JSON.stringify(subscriber))
    await kv.set(`${EMAIL_INDEX_PREFIX}:${email}`, id)
    await kv.set(`${TOKENS_PREFIX}:${token}`, id)

    return subscriber
}

// Confirm a subscriber using their token
export async function confirmSubscriber(token: string): Promise<Subscriber | null> {
    const subscriberId = await kv.get<string>(`${TOKENS_PREFIX}:${token}`)

    if (!subscriberId) {
        return null
    }

    const subscriberJson = await kv.get<string>(`${SUBSCRIBERS_PREFIX}:${subscriberId}`)

    if (!subscriberJson) {
        return null
    }

    const subscriber: Subscriber = JSON.parse(subscriberJson)

    if (subscriber.confirmed) {
        return subscriber
    }

    const confirmedSubscriber: Subscriber = {
        ...subscriber,
        confirmed: true,
        confirmationToken: undefined,
        updatedAt: new Date().toISOString(),
    }

    await kv.set(`${SUBSCRIBERS_PREFIX}:${subscriberId}`, JSON.stringify(confirmedSubscriber))
    await kv.del(`${TOKENS_PREFIX}:${token}`)

    return confirmedSubscriber
}

// Remove a subscriber
export async function removeSubscriber(id: string): Promise<boolean> {
    const subscriberJson = await kv.get<string>(`${SUBSCRIBERS_PREFIX}:${id}`)

    if (!subscriberJson) {
        return false
    }

    const subscriber: Subscriber = JSON.parse(subscriberJson)

    await kv.del(`${SUBSCRIBERS_PREFIX}:${id}`)
    await kv.del(`${EMAIL_INDEX_PREFIX}:${subscriber.email}`)

    if (subscriber.confirmationToken) {
        await kv.del(`${TOKENS_PREFIX}:${subscriber.confirmationToken}`)
    }

    return true
}

// Get a subscriber by email
export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
    const id = await kv.get<string>(`${EMAIL_INDEX_PREFIX}:${email}`)

    if (!id) {
        return null
    }

    const subscriberJson = await kv.get<string>(`${SUBSCRIBERS_PREFIX}:${id}`)

    if (!subscriberJson) {
        return null
    }

    return JSON.parse(subscriberJson)
}

// Get a subscriber by ID
export async function getSubscriberById(id: string): Promise<Subscriber | null> {
    const subscriberJson = await kv.get<string>(`${SUBSCRIBERS_PREFIX}:${id}`)

    if (!subscriberJson) {
        return null
    }

    return JSON.parse(subscriberJson)
}

// Get all confirmed subscribers
export async function getAllConfirmedSubscribers(): Promise<Subscriber[]> {
    const keys = await kv.keys(`${SUBSCRIBERS_PREFIX}:*`)
    const subscribers: Subscriber[] = []

    for (const key of keys) {
        const subscriberJson = await kv.get<string>(key)

        if (subscriberJson) {
            const subscriber: Subscriber = JSON.parse(subscriberJson)

            if (subscriber.confirmed) {
                subscribers.push(subscriber)
            }
        }
    }

    return subscribers
}

