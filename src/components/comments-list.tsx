import { format } from "date-fns"
import type { Comment } from "@/types/post"

export default function CommentsList({ comments }: { comments: Comment[] }) {
  if (!comments || comments.length === 0) {
    return <div className="text-center text-muted-foreground py-6">No comments yet. Be the first to comment!</div>
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{comment.authorName}</span>
            <time className="text-sm text-muted-foreground">{format(new Date(comment.createdAt), "MMM d, yyyy")}</time>
          </div>
          <p className="text-muted-foreground">{comment.content}</p>
        </div>
      ))}
    </div>
  )
}

