"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitAuthorApplication } from "@/app/actions/author-application"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle2, PenLine } from "lucide-react"

export default function BecomeAuthorAd() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await submitAuthorApplication(formData)

      if (result.success) {
        setIsSuccess(true)
        toast({
          title: "Application Submitted",
          description: "Thanks for your interest! We'll review your application and get back to you soon.",
          variant: "default",
        })
      } else {
        toast({
          title: "Submission Failed",
          description: result.message || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary/5 rounded-t-lg">
        <div className="flex items-center gap-2 text-primary mb-2">
          <PenLine className="h-5 w-5" />
          <CardTitle className="text-xl">Become a Contributing Author</CardTitle>
        </div>
        <CardDescription>
          Share your knowledge and insights with our community. Join our team of expert writers!
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Application Received!</h3>
            <p className="text-muted-foreground">
              Thanks for your interest in becoming an author. We'll review your application and get back to you soon.
            </p>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Your Name
              </label>
              <Input id="name" name="name" placeholder="John Doe" required disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="expertise" className="text-sm font-medium">
                Areas of Expertise (optional)
              </label>
              <Textarea
                id="expertise"
                name="expertise"
                placeholder="Web development, AI, Design, etc."
                disabled={isSubmitting}
                className="resize-none"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Apply to Become an Author"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        We respect your privacy and will only use your email to contact you about your application.
      </CardFooter>
    </Card>
  )
}

