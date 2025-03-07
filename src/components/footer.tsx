import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="Blog Logo" width={300} height={32} className="rounded-md" />

              </Link>
              <p className="text-muted-foreground mb-4 max-w-md">
                Cutting-edge tutorials, insights, and resources for modern web developers. Stay up-to-date with the latest
                trends in web development.
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://twitter.com/EVeldrine" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://github.com/Tech-Vexy" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://linkedin.com/in/veldrineevelia" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://www.facebook.com/profile.php?id=100082340336045" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Content</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/posts" className="text-muted-foreground hover:text-foreground">
                    All Posts
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/feed.xml" className="text-muted-foreground hover:text-foreground">
                    RSS Feed
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DevBlog. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

