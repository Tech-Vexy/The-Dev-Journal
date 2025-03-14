import { GraphQLClient } from "graphql-request"

const API_TOKEN = process.env.DATOCMS_API_TOKEN
const API_URL = "https://graphql.datocms.com"
const IS_DEVELOPMENT = process.env.NODE_ENV === "development"

// Create a request cache to deduplicate requests
const requestCache = new Map()

export function createDatoCMSClient() {
  if (!API_TOKEN) {
    if (IS_DEVELOPMENT) {
      console.warn("DatoCMS API token is not set in development mode")
    } else {
      console.error("DatoCMS API token is not set in production mode")
    }
    return null
  }

  const client = new GraphQLClient(API_URL, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      // Add preview mode header if needed
      ...(process.env.DATOCMS_PREVIEW_SECRET ? { "X-Include-Drafts": "true" } : {}),
    },
  })

  return {
    async request<T>(query: string, variables = {}, options = { deduplicate: true, cacheTTL: 60 }) {
      // Create a cache key based on the query and variables
      const cacheKey = JSON.stringify({ query, variables })

      // Check if we have a cached response and it's not expired
      if (options.deduplicate && requestCache.has(cacheKey)) {
        const cachedData = requestCache.get(cacheKey)
        if (cachedData.expiresAt > Date.now()) {
          return cachedData.data as T
        }
        // Remove expired cache entry
        requestCache.delete(cacheKey)
      }

      try {
        const data = await client.request<T>(query, variables)

        // Cache the response if deduplication is enabled
        if (options.deduplicate) {
          requestCache.set(cacheKey, {
            data,
            expiresAt: Date.now() + options.cacheTTL * 1000,
          })
        }

        return data
      } catch (error) {
        // Log the error with more details
        console.error("DatoCMS request failed:", {
          error: error.message,
          query: query.slice(0, 100) + "...", // Log only the beginning of the query
          variables,
        })

        // In production, we want to fail gracefully
        if (!IS_DEVELOPMENT) {
          return null
        }

        // In development, we can rethrow for better debugging
        throw error
      }
    },
  }
}

// Export a singleton instance
export const datoCMSClient = createDatoCMSClient()

