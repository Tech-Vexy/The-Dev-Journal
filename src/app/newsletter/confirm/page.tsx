import { confirmNewsletterSubscription } from "@/app/actions/newsletter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ConfirmNewsletterPage({
                                                        searchParams,
                                                    }: {
    searchParams: { token?: string }
}) {
    const token = searchParams.token

    if (!token) {
        return (
            <div className="container max-w-md mx-auto py-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Invalid Request</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="flex justify-center mb-4">
                            <XCircle className="h-12 w-12 text-red-500" />
                        </div>
                        <CardDescription className="text-base mb-6">
                            The confirmation link is invalid or has expired.
                        </CardDescription>
                        <Button asChild>
                            <Link href="/">Return to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const result = await confirmNewsletterSubscription(token)

    return (
        <div className="container max-w-md mx-auto py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">
                        {result.success ? "Subscription Confirmed" : "Confirmation Failed"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="flex justify-center mb-4">
                        {result.success ? (
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        ) : (
                            <XCircle className="h-12 w-12 text-red-500" />
                        )}
                    </div>
                    <CardDescription className="text-base mb-6">{result.message}</CardDescription>
                    <Button asChild>
                        <Link href="/">Return to Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

