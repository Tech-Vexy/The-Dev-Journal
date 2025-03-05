"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { sendNewsletter } from "@/app/actions/newsletter"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Send, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NewsletterAdminPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [subscriberCount, setSubscriberCount] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        // Fetch subscriber count
        fetch("/api/newsletter/subscribers/count")
            .then((res) => res.json())
            .then((data) => {
                setSubscriberCount(data.count)
                setIsLoading(false)
            })
            .catch((err) => {
                console.error("Error fetching subscriber count:", err)
                setIsLoading(false)
            })
    }, [])

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)

        try {
            const result = await sendNewsletter(formData)

            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message,
                })
                // Reset the form
                document.getElementById("newsletter-form")?.reset()
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                })
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send newsletter",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1>Newsletter Management</h1>
            <p className="text-muted-foreground mb-6">Manage your newsletter subscribers and send campaigns.</p>

            <div className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Subscriber Stats</CardTitle>
                        <CardDescription>Overview of your newsletter subscribers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                <span className="text-xl font-semibold">{subscriberCount}</span>
                                <span className="text-muted-foreground">confirmed subscribers</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="compose">
                <TabsList className="mb-4">
                    <TabsTrigger value="compose">Compose Newsletter</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="compose">
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Newsletter</CardTitle>
                            <CardDescription>Compose and send a newsletter to all confirmed subscribers.</CardDescription>
                        </CardHeader>
                        <form id="newsletter-form" action={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium">
                                        Subject
                                    </label>
                                    <Input id="subject" name="subject" placeholder="Newsletter subject" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="content" className="text-sm font-medium">
                                        Content (HTML)
                                    </label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        placeholder="<h1>Newsletter Content</h1><p>Write your newsletter content here...</p>"
                                        className="min-h-[300px] font-mono"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">You can use HTML tags to format your newsletter.</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const textarea = document.getElementById("content") as HTMLTextAreaElement
                                        textarea.value = getDefaultTemplate()
                                    }}
                                >
                                    Load Template
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Newsletter
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="templates">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Templates</CardTitle>
                            <CardDescription>Pre-designed templates for your newsletters</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert>
                                <AlertTitle>Basic Template</AlertTitle>
                                <AlertDescription>A simple template with header, content section, and footer.</AlertDescription>
                            </Alert>
                            <div className="mt-4">
                                <Button
                                    onClick={() => {
                                        const textarea = document.getElementById("content") as HTMLTextAreaElement
                                        textarea.value = getDefaultTemplate()

                                        // Switch to compose tab
                                        const composeTab = document.querySelector(
                                            '[data-state="inactive"][value="compose"]',
                                        ) as HTMLButtonElement
                                        if (composeTab) composeTab.click()
                                    }}
                                >
                                    Use Template
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function getDefaultTemplate() {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">DevBlog Newsletter</h1>
  </div>
  
  <div style="padding: 20px;">
    <h2>Hello Subscribers!</h2>
    <p>Here are our latest articles and updates:</p>
    
    <div style="margin: 20px 0; padding: 15px; border: 1px solid #eaeaea; border-radius: 5px;">
      <h3 style="margin-top: 0;">Article Title</h3>
      <p>Brief description of the article goes here...</p>
      <a href="#" style="color: #4F46E5; text-decoration: none;">Read more →</a>
    </div>
    
    <div style="margin: 20px 0; padding: 15px; border: 1px solid #eaeaea; border-radius: 5px;">
      <h3 style="margin-top: 0;">Another Article Title</h3>
      <p>Brief description of another article goes here...</p>
      <a href="#" style="color: #4F46E5; text-decoration: none;">Read more →</a>
    </div>
    
    <p>Thanks for subscribing to our newsletter!</p>
    <p>The Dev Journal Team</p>
  </div>
</div>`
}

