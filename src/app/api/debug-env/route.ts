import { NextResponse } from "next/server"

export async function GET() {
    // Get the first few characters of the token for verification
    // (without exposing the full token for security reasons)
    const token = process.env.DATOCMS_API_TOKEN || "not-set"
    const tokenPreview =
        token === "not-set" ? "not-set" : `${token.substring(0, 5)}...${token.substring(token.length - 3)}`

    return NextResponse.json({
        tokenSet: !!process.env.DATOCMS_API_TOKEN,
        tokenPreview,
        nodeEnv: process.env.NODE_ENV,
        allEnvKeys: Object.keys(process.env).filter(
            (key) => !key.includes("SECRET") && !key.includes("KEY") && !key.includes("TOKEN"),
        ),
    })
}

