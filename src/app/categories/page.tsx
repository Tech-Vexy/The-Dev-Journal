import { getAllCategories, getAllPosts } from "@/lib/datocms"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const metadata = {
    title: "Categories - DevBlog",
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

            {categories.length === 0 ? (
                <div className="space-y-6">
                    <Alert variant="default">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Categories not set up</AlertTitle>
                        <AlertDescription>
                            It looks like categories haven't been set up in your DatoCMS yet. Follow the instructions below to add
                            categories to your blog.
                        </AlertDescription>
                    </Alert>

                    <div className="prose max-w-none">
                        <h2>How to Set Up Categories in DatoCMS</h2>
                        <p>
                            To add categories to your blog, you'll need to create a Category model in DatoCMS and link it to your
                            posts:
                        </p>

                        <h3>Step 1: Create a Category Model</h3>
                        <ol>
                            <li>Go to your DatoCMS project and navigate to "Settings" &gt; "Models"</li>
                            <li>Click "Create new model"</li>
                            <li>Name it "Category" and set API identifier to "category"</li>
                            <li>
                                Add the following fields:
                                <ul>
                                    <li>
                                        <strong>Name</strong> (Single-line string)
                                    </li>
                                    <li>
                                        <strong>Slug</strong> (Slug, generate from Name)
                                    </li>
                                    <li>
                                        <strong>Description</strong> (Single-line string or Multi-line text)
                                    </li>
                                </ul>
                            </li>
                            <li>Save the model</li>
                        </ol>

                        <h3>Step 2: Link Categories to Posts</h3>
                        <ol>
                            <li>Go to your Post model in DatoCMS</li>
                            <li>Add a new field of type "Multiple links"</li>
                            <li>Name it "Categories" and set API identifier to "categories"</li>
                            <li>Set "Validations" to only allow links to the Category model</li>
                            <li>Save the model</li>
                        </ol>

                        <h3>Step 3: Add Some Categories</h3>
                        <ol>
                            <li>Go to "Content" in DatoCMS</li>
                            <li>Select "Categories" from the sidebar</li>
                            <li>Create a few categories (e.g., JavaScript, React, CSS)</li>
                            <li>Go to your posts and assign categories to them</li>
                        </ol>

                        <p>Once you've completed these steps, refresh this page to see your categories!</p>
                    </div>
                </div>
            ) : (
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
            )}
        </div>
    )
}

