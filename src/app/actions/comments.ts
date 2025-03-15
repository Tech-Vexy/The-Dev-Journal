"use server"

import { revalidatePath } from "next/cache"
import { addComment as addCommentToFile } from "@/lib/comments"

export async function addComment(postSlug: string, authorName: string, content: string) {
  if (!postSlug || !authorName || !content) {
    throw new Error("Missing required fields")
  }

  try {
    // Add comment to the file-based system
    const comment = await addCommentToFile(postSlug, authorName, content)

    if (!comment) {
      throw new Error("Failed to add comment")
    }

    // Revalidate the post page to show the new comment
    revalidatePath(`/posts/${postSlug}`)

    return comment
  } catch (error) {
    console.error("Error adding comment:", error)
    throw new Error("Failed to add comment")
  }
}

