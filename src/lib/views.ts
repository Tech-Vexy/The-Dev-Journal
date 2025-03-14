import { promises as fs } from "fs"
import path from "path"

const VIEWS_FILE = path.join("data", "views.json")

// Ensure the data directory and views file exist
async function ensureViewsFile() {
  try {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data")
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Ensure views file exists
    try {
      await fs.access(VIEWS_FILE)
    } catch {
      await fs.writeFile(VIEWS_FILE, "{}")
    }
  } catch (error) {
    console.error("Error ensuring views file:", error)
  }
}

// Get all views
async function getViews(): Promise<Record<string, number>> {
  await ensureViewsFile()
  try {
    const data = await fs.readFile(VIEWS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return {}
  }
}

// Save all views
async function saveViews(views: Record<string, number>) {
  await ensureViewsFile()
  await fs.writeFile(VIEWS_FILE, JSON.stringify(views, null, 2))
}

export async function incrementViewCount(slug: string): Promise<number> {
  try {
    const views = await getViews()
    const newCount = (views[slug] || 0) + 1
    views[slug] = newCount
    await saveViews(views)
    return newCount
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return 0
  }
}

export async function getViewCount(slug: string): Promise<number> {
  try {
    const views = await getViews()
    return views[slug] || 0
  } catch (error) {
    console.error("Error getting view count:", error)
    return 0
  }
}

