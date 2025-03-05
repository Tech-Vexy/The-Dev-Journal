import { NextResponse } from "next/server"
import { GraphQLClient } from "graphql-request"

export async function GET() {
    const API_TOKEN = process.env.DATOCMS_API_TOKEN
    const API_URL = "https://graphql.datocms.com"

    if (!API_TOKEN) {
        return NextResponse.json(
            {
                error: "DATOCMS_API_TOKEN environment variable is not set",
                status: "error",
                suggestion:
                    "Please set the DATOCMS_API_TOKEN environment variable in your .env.local file or in your deployment environment",
            },
            { status: 500 },
        )
    }

    const client = new GraphQLClient(API_URL, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
        },
    })

    try {
        // Simple query to check if the API token is valid
        const query = `
      query {
        _site {
          name
        }
      }
    `
        const data = await client.request(query)
        return NextResponse.json({
            status: "success",
            message: "DatoCMS connection successful",
            site: data._site.name,
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                error: "Failed to connect to DatoCMS",
                details: error.message,
                status: "error",
                suggestion: "Please check that your DATOCMS_API_TOKEN is correct and has the necessary permissions",
            },
            { status: 500 },
        )
    }
}

