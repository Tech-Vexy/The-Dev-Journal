"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState("")
  const [tokenPresent, setTokenPresent] = useState(false)

  useEffect(() => {
    checkDatoCmsConnection()
    checkEnvironmentVariables() // Add this line
  }, [])

  async function checkDatoCmsConnection() {
    setStatus("loading")
    try {
      // First check if the token is present in the environment
      const envCheckResponse = await fetch("/api/check-env?key=DATOCMS_API_TOKEN")
      const envCheckData = await envCheckResponse.json()
      setTokenPresent(envCheckData.present)

      // Then check the DatoCMS connection
      const response = await fetch("/api/check-datocms")
      const data = await response.json()

      if (data.status === "success") {
        setStatus("success")
        setMessage(`Successfully connected to DatoCMS site: ${data.site}`)
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to connect to DatoCMS")
        setDetails(data.suggestion || "")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to check DatoCMS connection")
      setDetails("An unexpected error occurred")
    }
  }

  async function checkEnvironmentVariables() {
    try {
      const response = await fetch("/api/debug-env")
      const data = await response.json()
      console.log("Environment variables debug info:", data)
      return data
    } catch (error) {
      console.error("Error checking environment variables:", error)
      return null
    }
  }

  return (
      <div className="max-w-3xl mx-auto">
        <h1>Admin Dashboard</h1>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>DatoCMS Connection Status</CardTitle>
            <CardDescription>Check if your blog can connect to DatoCMS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              {status === "loading" ? (
                  <div className="animate-pulse flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-muted"></div>
                    <div className="h-4 w-40 rounded bg-muted"></div>
                  </div>
              ) : status === "success" ? (
                  <div className="flex items-start gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">{message}</p>
                      <p className="text-sm text-muted-foreground mt-1">Your blog is correctly connected to DatoCMS</p>
                    </div>
                  </div>
              ) : (
                  <div className="flex items-start gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">{message}</p>
                      {details && <p className="text-sm mt-1">{details}</p>}
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 rounded text-sm">
                        <p className="font-medium">Troubleshooting steps:</p>
                        <ol className="list-decimal ml-5 mt-2 space-y-1">
                          <li>
                            {tokenPresent ? (
                                <span className="text-green-600">
                            ✓ DATOCMS_API_TOKEN is present in environment variables
                          </span>
                            ) : (
                                <span>
                            Add the DATOCMS_API_TOKEN to your .env.local file or deployment environment variables
                          </span>
                            )}
                          </li>
                          <li>Verify that the token has the correct permissions in DatoCMS</li>
                          <li>Make sure you've restarted your development server after adding the token</li>
                          <li>Check that your DatoCMS project has the required content models and fields</li>
                        </ol>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" asChild>
                          <Link href="https://www.datocms.com/docs/content-management-api/authentication" target="_blank">
                            DatoCMS API Token Documentation <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={checkDatoCmsConnection} disabled={status === "loading"}>
              {status === "loading" ? "Checking..." : "Check Connection Again"}
            </Button>
          </CardFooter>
        </Card>
      </div>
  )
}

