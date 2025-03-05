"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function KeyboardShortcuts() {
    const router = useRouter()

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            // Only trigger if no input/textarea is focused
            if (["input", "textarea"].includes((event.target as HTMLElement).tagName.toLowerCase())) {
                return
            }

            switch (event.key) {
                case "h":
                    router.push("/")
                    break
                case "k":
                    document.querySelector('[role="search"]')?.querySelector("button")?.click()
                    break
                case "ArrowLeft":
                    if (event.altKey) {
                        document.querySelector("[data-prev-post]")?.querySelector("a")?.click()
                    }
                    break
                case "ArrowRight":
                    if (event.altKey) {
                        document.querySelector("[data-next-post]")?.querySelector("a")?.click()
                    }
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [router])

    return null
}

