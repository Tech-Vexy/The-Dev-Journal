'use client';

import { getAllCategories, getAllPosts } from "@/lib/datocms"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
    title: "Categories - The Dev Journal",
    description: "Browse articles by category",
}

export default async function CategoriesPage() {
  const categories = await getAllCategories()
  const posts = await getAllPosts()

  // Count posts per category
  const categoryCounts = categories.map((category) => {
    const count = posts.filter((post) => post.categories?.some((cat) => cat.id === category.id)).length
    return { ...category, count }
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Categories</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoryCounts.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {category.name}
                  <span className="text-sm font-normal bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5">
                    {category.count} {category.count === 1 ? "post" : "posts"}
                  </span>
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {posts
                    .filter((post) => post.categories?.some((cat) => cat.id === category.id))
                    .slice(0, 3)
                    .map((post) => (
                      <Link
                        key={post.id}
                        href={`/posts/${post.slug}`}
                        className="text-sm text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {post.title}
                      </Link>
                    ))}
                  {category.count > 3 && (
                    <span className="text-sm text-muted-foreground">and {category.count - 3} more...</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

