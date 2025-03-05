import { getAllSubscribers, getSubscriberStats } from "@/lib/newsletter"
import { format } from "date-fns"
import { sendNewsletter } from "@/app/actions/newsletter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, CheckCircle, XCircle, Mail } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { unsubscribeFromNewsletter } from "@/app/actions/newsletter"

export default async function NewsletterAdminPage() {
    const subscribers = await getAllSubscribers()
    const stats = await getSubscriberStats()

    const confirmedSubscribers = subscribers.filter((sub) => sub.confirmed)
    const unconfirmedSubscribers = subscribers.filter((sub) => !sub.confirmed)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Newsletter Management</h1>
                <Button asChild variant="outline">
                    <Link href="/admin">Back to Admin</Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">{stats.confirmed}</div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Confirmations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">{stats.unconfirmed}</div>
                            <XCircle className="h-5 w-5 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Send Newsletter</CardTitle>
                        <CardDescription>Compose and send a newsletter to all confirmed subscribers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={sendNewsletter} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium">
                                    Subject
                                </label>
                                <Input id="subject" name="subject" placeholder="Newsletter subject" required />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="content" className="text-sm font-medium">
                                    Content (HTML supported)
                                </label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="Write your newsletter content here..."
                                    className="min-h-[200px]"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                <Mail className="h-4 w-4 mr-2" />
                                Send Newsletter
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                This will send to {stats.confirmed} confirmed subscribers.
                            </p>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Subscriber List</CardTitle>
                        <CardDescription>Manage your newsletter subscribers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="confirmed">
                            <TabsList className="mb-4">
                                <TabsTrigger value="confirmed">Confirmed ({confirmedSubscribers.length})</TabsTrigger>
                                <TabsTrigger value="unconfirmed">Pending ({unconfirmedSubscribers.length})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="confirmed" className="space-y-4">
                                {confirmedSubscribers.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No confirmed subscribers yet.</p>
                                ) : (
                                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                                        {confirmedSubscribers.map((subscriber) => (
                                            <div key={subscriber.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                                <div>
                                                    <p className="font-medium">{subscriber.email}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Subscribed on {format(new Date(subscriber.subscribedAt), "MMM d, yyyy")}
                                                    </p>
                                                </div>
                                                <form action={unsubscribeFromNewsletter.bind(null, subscriber.id)}>
                                                    <Button type="submit" variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                                        Remove
                                                    </Button>
                                                </form>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="unconfirmed" className="space-y-4">
                                {unconfirmedSubscribers.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No pending subscribers.</p>
                                ) : (
                                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                                        {unconfirmedSubscribers.map((subscriber) => (
                                            <div key={subscriber.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                                <div>
                                                    <p className="font-medium">{subscriber.email}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Requested on {format(new Date(subscriber.subscribedAt), "MMM d, yyyy")}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                          <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded">
                            Pending confirmation
                          </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

