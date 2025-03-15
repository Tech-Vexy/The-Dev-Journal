"use server"

import { addComment as addCommentToStorage } from "@/lib/comments"
import { revalidatePath } from "next/cache"

export async function addComment(postSlug: string, name: string, content: string) {
  if (!name || !content || !postSlug) {
    throw new Error("Missing required fields")
  }

  const comment = await addCommentToStorage(postSlug, name, content)
  revalidatePath(`/posts/${postSlug}`)
  return comment
}

