import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface AuthorProfileProps {
    author: {
        name: string
        picture?: {
            url: string
            alt?: string
        }
        biography?: string
    }
}

export default function AuthorProfile({ author }: AuthorProfileProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-accent/10 pb-0">
                <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted">
                        {author.picture?.url ? (
                            <Image
                                src={author.picture.url || "/placeholder.svg"}
                                alt={author.picture.alt || author.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                                {author.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{author.name}</h3>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {author.biography ? (
                    <p className="text-muted-foreground">{author.biography}</p>
                ) : (
                    <p className="text-muted-foreground italic">No biography available.</p>
                )}
            </CardContent>
        </Card>
    )
}

