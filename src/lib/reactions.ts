import { promises as fs } from "fs"
import path from "path"

export type ReactionType = "like" | "love" | "fire" | "clap" | "thinking"

export type Reaction = {
    postSlug: string
    type: ReactionType
    count: number
}

const REACTIONS_FILE = path.join(process.cwd(), "data", "reactions.json")

// Ensure the data directory exists
async function ensureDataDirectory() {
    const dataDir = path.join(process.cwd(), "data")
    try {
        await fs.access(dataDir)
    } catch {
        await fs.mkdir(dataDir)
    }
}

// Initialize reactions file if it doesn't exist
async function ensureReactionsFile() {
    try {
        await fs.access(REACTIONS_FILE)
    } catch {
        await fs.writeFile(REACTIONS_FILE, "[]")
    }
}

export async function getReactions(postSlug: string): Promise<Reaction[]> {
    await ensureDataDirectory()
    await ensureReactionsFile()

    const reactionsData = await fs.readFile(REACTIONS_FILE, "utf-8")
    const allReactions: Reaction[] = JSON.parse(reactionsData)

    // Get reactions for this post
    const postReactions = allReactions.filter((reaction) => reaction.postSlug === postSlug)

    // If no reactions exist for this post, initialize with zero counts
    if (postReactions.length === 0) {
        const defaultReactions: Reaction[] = [
            { postSlug, type: "like", count: 0 },
            { postSlug, type: "love", count: 0 },
            { postSlug, type: "fire", count: 0 },
            { postSlug, type: "clap", count: 0 },
            { postSlug, type: "thinking", count: 0 },
        ]
        return defaultReactions
    }

    return postReactions
}

export async function addReaction(postSlug: string, type: ReactionType): Promise<Reaction[]> {
    await ensureDataDirectory()
    await ensureReactionsFile()

    const reactionsData = await fs.readFile(REACTIONS_FILE, "utf-8")
    const allReactions: Reaction[] = JSON.parse(reactionsData)

    // Find the specific reaction
    const reactionIndex = allReactions.findIndex((reaction) => reaction.postSlug === postSlug && reaction.type === type)

    if (reactionIndex >= 0) {
        // Increment existing reaction
        allReactions[reactionIndex].count += 1
    } else {
        // Add new reaction
        allReactions.push({ postSlug, type, count: 1 })
    }

    // Save updated reactions
    await fs.writeFile(REACTIONS_FILE, JSON.stringify(allReactions, null, 2))

    // Return updated reactions for this post
    return allReactions.filter((reaction) => reaction.postSlug === postSlug)
}

