const BULLET_REGEX = /^[-*+\d.)\s]+/

export const parseFocusAreas = (focusText: string, limit = 8): string[] => {
  if (!focusText) {
    return []
  }

  const normalized = focusText
    .split(/\r?\n|[,;|]+/g)
    .map((chunk) => chunk.replace(BULLET_REGEX, "").trim())
    .filter(Boolean)

  const unique = Array.from(new Set(normalized))
  return unique.slice(0, limit)
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}...`
}
