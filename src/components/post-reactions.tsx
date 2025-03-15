"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ThumbsUp, Heart, Laugh, AlertCircle, Frown, Angry } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { Reaction } from "@/types/post"

interface PostReactionsProps {
  postId: string
  postSlug: string
  reactions: Reaction[]
}

type ReactionName = "like" | "love" | "laugh" | "wow" | "sad" | "angry"

interface ReactionConfig {
  name: ReactionName
  icon: React.ReactNode
  label: string
  color: string
}

// Local storage key format: reaction_{postSlug}_{reactionName}
const getStorageKey = (postSlug: string, reactionName: string) => `reaction_${postSlug}_${reactionName}`

export default function PostReactions({ postId, postSlug, reactions }: PostReactionsProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeReaction, setActiveReaction] = useState<ReactionName | null>(null)
  const [localReactionCounts, setLocalReactionCounts] = useState<Record<ReactionName, number>>(
    {} as Record<ReactionName, number>,
  )

  // Initialize from localStorage and DatoCMS reactions
  useEffect(() => {
    // Start with DatoCMS reactions
    const initialCounts = reactions.reduce(
      (acc, reaction) => {
        acc[reaction.name as ReactionName] = reaction.count
        return acc
      },
      {} as Record<ReactionName, number>,
    )

    // Check if user has previously reacted
    const reactionTypes: ReactionName[] = ["like", "love", "laugh", "wow", "sad", "angry"]
    let userActiveReaction: ReactionName | null = null

    reactionTypes.forEach((type) => {
      const hasReacted = localStorage.getItem(getStorageKey(postSlug, type)) === "true"
      if (hasReacted) {
        userActiveReaction = type
      }
    })

    setActiveReaction(userActiveReaction)
    setLocalReactionCounts(initialCounts)
  }, [postSlug, reactions])

  const reactionConfigs: ReactionConfig[] = [
    {
      name: "like",
      icon: <ThumbsUp className="h-5 w-5" />,
      label: "Like",
      color: "text-blue-500",
    },
    {
      name: "love",
      icon: <Heart className="h-5 w-5" />,
      label: "Love",
      color: "text-red-500",
    },
    {
      name: "laugh",
      icon: <Laugh className="h-5 w-5" />,
      label: "Laugh",
      color: "text-yellow-500",
    },
    {
      name: "wow",
      icon: <AlertCircle className="h-5 w-5" />,
      label: "Wow",
      color: "text-purple-500",
    },
    {
      name: "sad",
      icon: <Frown className="h-5 w-5" />,
      label: "Sad",
      color: "text-indigo-500",
    },
    {
      name: "angry",
      icon: <Angry className="h-5 w-5" />,
      label: "Angry",
      color: "text-orange-500",
    },
  ]

  function handleReaction(name: ReactionName) {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const newCounts = { ...localReactionCounts }

      if (activeReaction === name) {
        // Remove reaction if clicking the same one
        localStorage.removeItem(getStorageKey(postSlug, name))
        newCounts[name] = Math.max(0, (newCounts[name] || 0) - 1)
        setActiveReaction(null)
      } else {
        // Add new reaction
        if (activeReaction) {
          // Remove previous reaction if exists
          localStorage.removeItem(getStorageKey(postSlug, activeReaction))
          newCounts[activeReaction] = Math.max(0, (newCounts[activeReaction] || 0) - 1)
        }

        // Set new reaction
        localStorage.setItem(getStorageKey(postSlug, name), "true")
        newCounts[name] = (newCounts[name] || 0) + 1
        setActiveReaction(name)
      }

      setLocalReactionCounts(newCounts)
    } catch (error) {
      console.error("Error updating reaction:", error)
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-semibold">Reactions</h3>
      <div className="flex flex-wrap gap-2">
        {reactionConfigs.map((config) => (
          <Button
            key={config.name}
            variant="outline"
            size="sm"
            className={`flex items-center gap-1 ${activeReaction === config.name ? config.color + " border-2" : ""}`}
            onClick={() => handleReaction(config.name)}
            disabled={isSubmitting}
          >
            <span className={config.color}>{config.icon}</span>
            <span>{config.label}</span>
            <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5">
              {localReactionCounts[config.name] || 0}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}

