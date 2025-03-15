"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addComment } from "@/app/actions/comments"
import { useToast } from "@/components/ui/use-toast"

interface CommentFormProps {
  postId: string
  postSlug: string
  onCommentAdded?: () => void
}

export default function CommentForm({ postId, postSlug, onCommentAdded }: CommentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const authorName = formData.get("name") as string
    const content = formData.get("content") as string

    try {
      // Use the slug for the comment
      await addComment(postSlug, authorName, content)

      // Use the form ref to reset the form
      if (formRef.current) {
        formRef.current.reset()
      }

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })

      // Call the onCommentAdded callback if provided
      if (onCommentAdded) {
        onCommentAdded()
      }

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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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

