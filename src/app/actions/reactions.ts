"use server"

import { addReaction as addReactionToStorage, getReactions, type ReactionType } from "@/lib/reactions"
import { revalidatePath } from "next/cache"

export async function addReaction(postSlug: string, type: ReactionType) {
    if (!postSlug || !type) {
        throw new Error("Missing required fields")
    }

    const updatedReactions = await addReactionToStorage(postSlug, type)
    revalidatePath(`/posts/${postSlug}`)
    return updatedReactions
}

export async function getPostReactions(postSlug: string) {
    if (!postSlug) {
        throw new Error("Post slug is required")
    }

    return await getReactions(postSlug)
}

