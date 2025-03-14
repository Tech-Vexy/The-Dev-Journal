export function calculateReadingTime(content: any): number {
  // If content is a string, use it directly
  if (typeof content === "string") {
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / 200) // Assuming 200 words per minute reading speed
  }

  // If content is a structured text object
  if (content && typeof content === "object") {
    // Extract text from structured content
    let text = ""

    // If it's a structured text value object with document property
    if (content.document) {
      const extractText = (node: any): string => {
        if (!node) return ""

        // If it's a text node
        if (typeof node.value === "string") return node.value

        // If it's a paragraph or other node with children
        if (Array.isArray(node.children)) {
          return node.children.map(extractText).join(" ")
        }

        // If it has content property (for blocks)
        if (node.content) {
          return Array.isArray(node.content) ? node.content.map(extractText).join(" ") : ""
        }

        return ""
      }

      // Process all nodes in the document
      if (Array.isArray(content.document.children)) {
        text = content.document.children.map(extractText).join(" ")
      }
    }

    const words = text.trim().split(/\s+/).length || 0
    return Math.max(1, Math.ceil(words / 200)) // Minimum 1 minute read
  }

  // Default fallback
  return 1
}

