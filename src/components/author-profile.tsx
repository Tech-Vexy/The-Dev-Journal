import Image from "next/image"
import { Twitter, Github, Linkedin, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthorProfileProps {
  author: {
    name: string

    picture?: {
      url: string
      alt?: string
    }
    biography?: string
    twitter?: string
    github?: string
    linkedin?: string
    facebook?: string
  }
}

export default function AuthorProfile({ author }: AuthorProfileProps) {
  if (!author) return null

  return (
    <div className="bg-muted/30 p-6 rounded-lg flex flex-col md:flex-row gap-6 items-center md:items-start">
      {author.picture && (
        <div className="flex-shrink-0">
          <Image
            src={author.picture.url || "/placeholder.svg"}
            alt={author.picture.alt || `${author.name}'s profile picture`}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
      )}
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl font-bold mb-2">{author.name}</h3>
        {author.biography && <p className="text-muted-foreground mb-4">{author.biography}</p>}

        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {author.twitter && (
            <Button variant="outline" size="icon" asChild>
              <a href={author.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          )}
          {author.github && (
            <Button variant="outline" size="icon" asChild>
              <a href={author.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {author.linkedin && (
            <Button variant="outline" size="icon" asChild>
              <a href={author.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {author.facebook && (
            <Button variant="outline" size="icon" asChild>
              <a href={author.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

