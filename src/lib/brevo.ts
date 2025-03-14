"use server"

const BREVO_API_URL = "https://api.brevo.com/v3"
const BREVO_API_KEY = process.env.BREVO_API_KEY

if (!BREVO_API_KEY) {
  console.warn("Warning: BREVO_API_KEY environment variable is not set")
}

// Type definitions for Brevo API
export type BrevoContact = {
  id?: number
  email: string
  attributes?: Record<string, any>
  listIds?: number[]
  emailBlacklisted?: boolean
  smsBlacklisted?: boolean
  createdAt?: string
  modifiedAt?: string
}

export type BrevoList = {
  id: number
  name: string
  totalBlacklisted: number
  totalSubscribers: number
  uniqueSubscribers: number
}

// Create a contact in Brevo
export async function createContact(
  email: string,
  attributes: Record<string, any> = {},
  listIds: number[] = [],
): Promise<BrevoContact> {
  try {
    const response = await fetch(`${BREVO_API_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY || "",
      },
      body: JSON.stringify({
        email,
        attributes,
        listIds,
        updateEnabled: true, // Update the contact if it already exists
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to create contact: ${error.message || JSON.stringify(error)}`)
    }

    // Get the contact details
    return await getContactByEmail(email)
  } catch (error: any) {
    console.error("Error creating contact:", error)
    throw error
  }
}

// Get a contact by email
export async function getContactByEmail(email: string): Promise<BrevoContact | null> {
  try {
    const response = await fetch(`${BREVO_API_URL}/contacts/${encodeURIComponent(email)}`, {
      headers: {
        "api-key": BREVO_API_KEY || "",
      },
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get contact: ${error.message || JSON.stringify(error)}`)
    }

    return await response.json()
  } catch (error: any) {
    if (error.message && error.message.includes("404")) {
      return null
    }
    console.error("Error getting contact:", error)
    throw error
  }
}

// Update a contact in Brevo
export async function updateContact(
  email: string,
  attributes: Record<string, any> = {},
  listIds: number[] = [],
): Promise<void> {
  try {
    const response = await fetch(`${BREVO_API_URL}/contacts/${encodeURIComponent(email)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY || "",
      },
      body: JSON.stringify({
        attributes,
        listIds,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to update contact: ${error.message || JSON.stringify(error)}`)
    }
  } catch (error: any) {
    console.error("Error updating contact:", error)
    throw error
  }
}

// Delete a contact from Brevo
export async function deleteContact(email: string): Promise<void> {
  try {
    const response = await fetch(`${BREVO_API_URL}/contacts/${encodeURIComponent(email)}`, {
      method: "DELETE",
      headers: {
        "api-key": BREVO_API_KEY || "",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to delete contact: ${error.message || JSON.stringify(error)}`)
    }
  } catch (error: any) {
    console.error("Error deleting contact:", error)
    throw error
  }
}

// Get all lists
export async function getLists(): Promise<BrevoList[]> {
  try {
    const response = await fetch(`${BREVO_API_URL}/contacts/lists?limit=50`, {
      headers: {
        "api-key": BREVO_API_KEY || "",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get lists: ${error.message || JSON.stringify(error)}`)
    }

    const data = await response.json()
    return data.lists || []
  } catch (error: any) {
    console.error("Error getting lists:", error)
    throw error
  }
}

// Create a list
export async function createList(name: string): Promise<BrevoList> {
  try {
    const response = await fetch(`${BREVO_API_URL}/contacts/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY || "",
      },
      body: JSON.stringify({
        name,
        folderId: 1, // Default folder
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to create list: ${error.message || JSON.stringify(error)}`)
    }

    const data = await response.json()
    return {
      id: data.id,
      name,
      totalBlacklisted: 0,
      totalSubscribers: 0,
      uniqueSubscribers: 0,
    }
  } catch (error: any) {
    console.error("Error creating list:", error)
    throw error
  }
}

// Get or create the newsletter list
export async function getOrCreateNewsletterList(): Promise<number> {
  try {
    const lists = await getLists()
    const newsletterList = lists.find((list) => list.name === "Blog Newsletter")

    if (newsletterList) {
      return newsletterList.id
    }

    // Create the list if it doesn't exist
    const newList = await createList("Blog Newsletter")
    return newList.id
  } catch (error: any) {
    console.error("Error getting or creating newsletter list:", error)
    throw error
  }
}

// Send a transactional email
export async function sendEmail({
  to,
  subject,
  htmlContent,
  sender = { name: "DevBlog", email: "newsletter@devblog.com" },
  params,
}: {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
  sender?: { name: string; email: string }
  params?: Record<string, any>
}) {
  try {
    // Create the request body
    const requestBody: any = {
      sender,
      to,
      subject,
      htmlContent,
    }

    // Only add params if it's provided and not empty
    if (params && Object.keys(params).length > 0) {
      requestBody.params = params
    }

    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY || "",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to send email: ${error.message || JSON.stringify(error)}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Get the count of subscribers in a list
export async function getSubscribersCount(listId: number): Promise<number> {
  try {
    const response = await fetch(`${BREVO_API_URL}/contacts/lists/${listId}`, {
      headers: {
        "api-key": BREVO_API_KEY || "",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to get list: ${error.message || JSON.stringify(error)}`)
    }

    const data = await response.json()
    return data.uniqueSubscribers || 0
  } catch (error: any) {
    console.error("Error getting subscribers count:", error)
    return 0
  }
}

