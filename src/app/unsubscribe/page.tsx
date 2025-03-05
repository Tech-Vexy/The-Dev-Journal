import { unsubscribeFromNewsletter } from "@/app/actions/newsletter"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function UnsubscribePage({
                                                  searchParams,
                                              }: {
    searchParams: { id?: string }
}) {
    const id = searchParams.id

    if (!id) {
        return (
            <div className="max-w-md mx-auto my-16 p-6 bg-card rounded-lg shadow-sm">
                <div className="flex flex-col items-center text-center">
                    <XCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Invalid Request</h1>
                    <p className="text-muted-foreground mb-6">The unsubscribe link is invalid.</p>
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const result = await unsubscribeFromNewsletter(id)

    return (
        <div className="max-w-md mx-auto my-16 p-6 bg-card rounded-lg shadow-sm">
            <div className="flex flex-col items-center text-center">
                {result.success ? (
                    <>
                        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Unsubscribed Successfully</h1>
                        <p className="text-muted-foreground mb-6">{result.message}</p>
                    </>
                ) : (
                    <>
                        <XCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Unsubscribe Failed</h1>
                        <p className="text-muted-foreground mb-6">{result.message}</p>
                    </>
                )}
                <Button asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        </div>
    )
}

