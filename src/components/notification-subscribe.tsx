"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function NotificationSubscribe() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if the browser supports push notifications
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setIsLoading(false)
      return
    }

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        setRegistration(reg)
        return reg.pushManager.getSubscription()
      })
      .then((subscription) => {
        setIsSubscribed(!!subscription)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error)
        setIsLoading(false)
      })
  }, [])

  async function subscribe() {
    try {
      setIsLoading(true)

      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        throw new Error("Notification permission denied")
      }

      // Subscribe to push notifications
      const subscription = await registration?.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      // Send subscription to server
      if (subscription) {
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        })

        setIsSubscribed(true)
        toast({
          title: "Notifications enabled",
          description: "You'll now receive notifications for new posts.",
        })
      }
    } catch (error) {
      console.error("Error subscribing to notifications:", error)
      toast({
        title: "Error",
        description: "Failed to enable notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function unsubscribe() {
    try {
      setIsLoading(true)
      const subscription = await registration?.pushManager.getSubscription()
      await subscription?.unsubscribe()
      setIsSubscribed(false)
      toast({
        title: "Notifications disabled",
        description: "You won't receive any more notifications.",
      })
    } catch (error) {
      console.error("Error unsubscribing from notifications:", error)
      toast({
        title: "Error",
        description: "Failed to disable notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={isLoading}
      title={isSubscribed ? "Disable notifications" : "Enable notifications"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSubscribed ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
    </Button>
  )
}

