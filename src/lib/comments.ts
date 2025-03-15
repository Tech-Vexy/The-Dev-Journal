import { promises as fs } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export type Comment = {
  id: string
  postSlug: string
  authorName: string
  content: string
  createdAt: string
}

const COMMENTS_DIR = path.join(process.cwd(), "data")
const COMMENTS_FILE = path.join(COMMENTS_DIR, "comments.json")

// Ensure the data directory exists
async function ensureDataDirectory() {
  try {
    await fs.access(COMMENTS_DIR)
  } catch {
    await fs.mkdir(COMMENTS_DIR, { recursive: true })
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

export async function addComment(postSlug: string, authorName: string, content: string): Promise<Comment> {
  await ensureDataDirectory()
  await ensureCommentsFile()

  const commentsData = await fs.readFile(COMMENTS_FILE, "utf-8")
  const comments: Comment[] = JSON.parse(commentsData)

  const newComment: Comment = {
    id: uuidv4(),
    postSlug,
    authorName,
    content,
    createdAt: new Date().toISOString(),
  }

  comments.push(newComment)
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2))

  return newComment
}

