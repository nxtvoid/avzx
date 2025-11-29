export function processText(text: string | undefined): string {
  if (!text || text.trim() === '') return ''

  const trimmedText = String(text).trim()
  const words = trimmedText.split(/\s+/).filter((word) => word.length > 0)

  let result: string

  if (words.length > 1) {
    result = words
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
  } else {
    result = trimmedText.slice(0, 2)
  }

  return result.toUpperCase()
}
