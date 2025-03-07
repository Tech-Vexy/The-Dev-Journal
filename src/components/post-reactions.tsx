"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { addReaction, getPostReactions } from "@/app/actions/reactions"
import { useToast } from "@/hooks/use-toast"
import type { Reaction, ReactionType } from "@/lib/reactions"
import { motion } from "framer-motion"

const reactionEmojis: Record<ReactionType, { emoji: string; label: string }> = {
    like: { emoji: "👍", label: "Like" },
    love: { emoji: "❤️", label: "Love" },
    fire: { emoji: "🔥", label: "Fire" },
    clap: { emoji: "👏", label: "Clap" },
    thinking: { emoji: "🤔", label: "Thinking" },
}

interface PostReactionsProps {
    postSlug: string
}

export default function PostReactions({ postSlug }: PostReactionsProps) {
    const [reactions, setReactions] = useState<Reaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [recentlyClicked, setRecentlyClicked] = useState<ReactionType | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        async function loadReactions() {
            try {
                const postReactions = await getPostReactions(postSlug)
                setReactions(postReactions)
            } catch (error) {
                console.error("Error loading reactions:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadReactions()
    }, [postSlug])

    async function handleReaction(type: ReactionType) {
        try {
            setRecentlyClicked(type)
            const updatedReactions = await addReaction(postSlug, type)
            setReactions(updatedReactions)

            // Reset the recently clicked state after animation
            setTimeout(() => setRecentlyClicked(null), 1000)
        } catch (error) {
            console.error("Error adding reaction:", error)
            toast({
                title: "Error",
                description: "Failed to add reaction. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center space-x-2 my-6 animate-pulse">
                {Object.keys(reactionEmojis).map((type) => (
                        <div key={type} className="w-12 h-12 bg-muted rounded-full"></div>
        ))}
        </div>
    )
    }

    return (
        <div className="my-6">
        <h3 className="text-center text-sm font-medium text-muted-foreground mb-3">What did you think of this post?</h3>
        <div className="flex flex-wrap justify-center gap-2">
        {Object.entries(reactionEmojis).map(([type, { emoji, label }]) => {
                const reaction = reactions.find((r) => r.type === type)
                const count = reaction?.count || 0
                const isRecent = recentlyClicked === type

                return (
                    <div key={type} className="flex flex-col items-center">
                <Button
                    variant="ghost"
                size="lg"
                className="relative h-auto rounded-full px-3 py-2 hover:bg-muted"
                onClick={() => handleReaction(type as ReactionType)}
            >
                <span className="text-2xl">
                    {isRecent ? (
                            <motion.span initial={{ scale: 1 }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5 }}>
                {emoji}
                </motion.span>
            ) : (
                    emoji
                )}
                </span>
                <span className="sr-only">{label}</span>
                    </Button>
                    <span className="text-xs font-medium mt-1">{count}</span>
                    </div>
            )
            })}
        </div>
        </div>
)
}

