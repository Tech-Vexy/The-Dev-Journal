import { kv } from "@vercel/kv"
export type Comment = {
  id: string
  postSlug: string
  name: string
  content: string
  createdAt: string
}

// Key prefix for comments in KV store
const COMMENTS_KEY_PREFIX = "comments:"

export async function getComments(postSlug: string): Promise<Comment[]> {
  try {
    // Get comments for the specific post
    const comments = (await kv.get<Comment[]>(`${COMMENTS_KEY_PREFIX}${postSlug}`)) || []

    // Sort comments by date (newest first)
    return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error getting comments:", error)
    return []
  }
}

export async function addComment(postSlug: string, name: string, content: string): Promise<Comment> {
  try {
    // Get existing comments
    const comments = await getComments(postSlug)

    // Create new comment
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      postSlug,
      name,
      content,
      createdAt: new Date().toISOString(),
    }

    // Add new comment to the list
    const updatedComments = [...comments, newComment]

    // Save updated comments list
    await kv.set(`${COMMENTS_KEY_PREFIX}${postSlug}`, updatedComments)

    return newComment
  } catch (error) {
    console.error("Error adding comment:", error)
    throw new Error("Failed to add comment")
  }
}

