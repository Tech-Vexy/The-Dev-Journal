import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
        return NextResponse.json({ error: "No key provided" }, { status: 400 })
    }

    // Check if the environment variable exists
    const value = process.env[key]
    const present = !!value

    // Don't return the actual value for security reasons
    return NextResponse.json({ present })
}

