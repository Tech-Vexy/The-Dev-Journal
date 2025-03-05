import Link from "next/link"
import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
    category: {
        name: string
        slug: string
    }
    className?: string
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
    return (
        <Link
            href={`/categories/${category.slug}`}
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
                className,
            )}
        >
            {category.name}
        </Link>
    )
}

