"use server"

import { revalidatePath } from "next/cache"
import { updateReaction } from "@/lib/datocms"

export async function addReaction(postId: string, slug: string, name: string) {
  if (!postId || !name) {
    throw new Error("Missing required fields")
  }

  try {
    const reaction = await updateReaction(postId, name, true)

    if (!reaction) {
      throw new Error("Failed to add reaction")
    }

    // Revalidate the post page to show the updated reaction count
    revalidatePath(`/posts/${slug}`)

    return reaction
  } catch (error) {
    console.error("Error adding reaction:", error)
    throw new Error("Failed to add reaction")
  }
}

export async function removeReaction(postId: string, slug: string, name: string) {
  if (!postId || !name) {
    throw new Error("Missing required fields")
  }

  try {
    const reaction = await updateReaction(postId, name, false)

    if (!reaction) {
      throw new Error("Failed to remove reaction")
    }

    // Revalidate the post page to show the updated reaction count
    revalidatePath(`/posts/${slug}`)

    return reaction
  } catch (error) {
    console.error("Error removing reaction:", error)
    throw new Error("Failed to remove reaction")
  }
}

