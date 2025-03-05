"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { subscribeToNewsletter } from "@/app/actions/newsletter"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NewsletterForm() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const { toast } = useToast()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setSuccessMessage(null)

        try {
            const result = await subscribeToNewsletter(email)

            if (result.success) {
                setSuccessMessage(result.message)
                setEmail("")
                toast({
                    title: "Success!",
                    description: result.message,
                })
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to subscribe. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-accent/5 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">Get the latest posts delivered right to your inbox.</p>

            {successMessage ? (
                <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 mb-4">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <AlertDescription className="text-green-700 dark:text-green-300">{successMessage}</AlertDescription>
                </Alert>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background"
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Subscribing...
                            </>
                        ) : (
                            "Subscribe"
                        )}
                    </Button>
                </form>
            )}
        </div>
    )
}

