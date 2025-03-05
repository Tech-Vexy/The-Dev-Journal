import { getAllCategories, getAllPosts } from "@/lib/datocms"
import { notFound } from "next/navigation"
import PostCard from "@/components/post-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export async function generateStaticParams() {
    const categories = await getAllCategories()
    return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const categories = await getAllCategories()
    const category = categories.find((cat) => cat.slug === params.slug)

    if (!category) {
        return { title: "Category Not Found" }
    }

    return {
        title: `${category.name} - DevBlog`,
        description: category.description,
    }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const categories = await getAllCategories()
    const category = categories.find((cat) => cat.slug === params.slug)

    if (!category) {
        notFound()
    }

    const allPosts = await getAllPosts()
    const posts = allPosts.filter((post) => post.categories?.some((cat) => cat.slug === params.slug))

    return (
        <div className="container mx-auto px-4 py-12">
            <Link
                href="/categories"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8"
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to categories
            </Link>

            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                {category.description && <p className="text-xl text-muted-foreground">{category.description}</p>}
            </div>

            {posts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-xl text-muted-foreground">No posts found in this category.</p>
                    <Link href="/" className="text-primary hover:underline mt-4 inline-block">
                        Browse all posts
                    </Link>
                </div>
            )}
        </div>
    )
}

