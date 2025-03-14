"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addComment } from "@/app/actions/comments"
import { useToast } from "@/components/ui/use-toast"

export default function CommentForm({ postId, postSlug }: { postId: string; postSlug: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const authorName = formData.get("name") as string
    const content = formData.get("content") as string

    try {
      await addComment(postId, authorName, content)
      event.currentTarget.reset()
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })
      router.refresh()
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast({
        title: "Error",
        description: "Failed to add your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input type="text" name="name" placeholder="Your name" required minLength={2} maxLength={50} />
      </div>
      <div>
        <Textarea
          name="content"
          placeholder="Write a comment..."
          required
          minLength={10}
          maxLength={500}
          className="h-24"
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Comment"}
      </Button>
    </form>
  )
}

