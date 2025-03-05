import { promises as fs } from "fs"
import path from "path"

export type Comment = {
  id: string
  postSlug: string
  name: string
  content: string
  createdAt: string
}

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json")

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir)
  }
}

// Initialize comments file if it doesn't exist
async function ensureCommentsFile() {
  try {
    await fs.access(COMMENTS_FILE)
  } catch {
    await fs.writeFile(COMMENTS_FILE, "[]")
  }
}

export async function getComments(postSlug: string): Promise<Comment[]> {
  await ensureDataDirectory()
  await ensureCommentsFile()

  const commentsData = await fs.readFile(COMMENTS_FILE, "utf-8")
  const comments: Comment[] = JSON.parse(commentsData)

  return comments
    .filter((comment) => comment.postSlug === postSlug)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function addComment(postSlug: string, name: string, content: string): Promise<Comment> {
  await ensureDataDirectory()
  await ensureCommentsFile()

  const commentsData = await fs.readFile(COMMENTS_FILE, "utf-8")
  const comments: Comment[] = JSON.parse(commentsData)

  const newComment: Comment = {
    id: Math.random().toString(36).substring(2, 9),
    postSlug,
    name,
    content,
    createdAt: new Date().toISOString(),
  }

  comments.push(newComment)
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2))

  return newComment
}

