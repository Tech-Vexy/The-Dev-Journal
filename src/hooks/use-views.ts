"use client"

import { useEffect, useState } from "react"

export function useViews(slug: string) {
    const [views, setViews] = useState<number | null>(null)

    useEffect(() => {
        // Get initial view count
        fetch(`/api/views?slug=${encodeURIComponent(slug)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.views !== undefined) {
                    setViews(data.views)
                }
            })
            .catch(console.error)

        // Increment view count
        fetch(`/api/views?slug=${encodeURIComponent(slug)}`, { method: "POST" })
            .then((res) => res.json())
            .then((data) => {
                if (data.views !== undefined) {
                    setViews(data.views)
                }
            })
            .catch(console.error)
    }, [slug])

    return views
}

