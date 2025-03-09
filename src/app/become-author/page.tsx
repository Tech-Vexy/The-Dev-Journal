import type { Metadata } from "next"
import BecomeAuthorAd from "@/components/become-author-ad"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Become an Author | The Dev Journal",
  description: "Join our team of expert authors and share your knowledge with the developer community.",
}

export default function BecomeAuthorPage() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to home
      </Link>

      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Become an Author</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your expertise with our community of developers and help others grow their skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Why Write for Us?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary p-1 rounded mr-3 mt-1">✓</span>
                <span>
                  <strong>Reach</strong>: Share your knowledge with thousands of developers worldwide.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary p-1 rounded mr-3 mt-1">✓</span>
                <span>
                  <strong>Recognition</strong>: Build your personal brand and establish yourself as an expert.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary p-1 rounded mr-3 mt-1">✓</span>
                <span>
                  <strong>Community</strong>: Join a network of passionate developers and writers.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary p-1 rounded mr-3 mt-1">✓</span>
                <span>
                  <strong>Growth</strong>: Refine your technical writing skills with editorial support.
                </span>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold pt-4">What We're Looking For</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary p-1 rounded mr-3 mt-1">✓</span>
                <span>In-depth tutorials and guides on web development topics</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary p-1 rounded mr-3 mt-1">✓</span>
                <span>Case studies and real-world problem-solving articles</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary p-1 rounded mr-3 mt-1">✓</span>
                <span>Insights on emerging technologies and best practices</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary p-1 rounded mr-3 mt-1">✓</span>
                <span>Clear, concise, and engaging technical content</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Apply to Join Our Team</h2>
            <BecomeAuthorAd fullWidth />
          </div>
        </div>
      </div>
    </div>
  )
}

