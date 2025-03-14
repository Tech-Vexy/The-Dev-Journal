import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, Facebook, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Blog Logo" width={309} height={65} className="rounded-md" />
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Cutting-edge tutorials, insights, and resources for modern web developers. Stay up-to-date with the latest
              trends in web development.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="https://twitter.com/EVeldrine" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="https://github.com/Tech-Vexy" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="https://linkedin.com/in/veldrineevelia" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="https://web.facebook.com/profile.php?id=100082340336045" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="mailto:TheDevJournal@protonmail.com" aria-label="Email">
                  <Mail className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Content</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/posts" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Posts
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/discover" className="text-muted-foreground hover:text-foreground transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/rss.xml" className="text-muted-foreground hover:text-foreground transition-colors">
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/become-author" className="text-muted-foreground hover:text-foreground transition-colors">
                  Become an Author
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-4">
            <h3 className="font-semibold mb-4">Subscribe to our newsletter</h3>
            <p className="text-muted-foreground mb-4">Get the latest posts delivered right to your inbox.</p>
            <div className="flex items-center gap-2">
              <Input type="email" placeholder="Your email" className="max-w-xs" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} The Dev Journal. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

