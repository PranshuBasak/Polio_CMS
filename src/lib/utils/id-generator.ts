import { nanoid } from "nanoid"

/**
 * Generate a unique ID for entities
 * Uses nanoid for collision-resistant IDs
 */
export function generateId(): string {
  return nanoid()
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
