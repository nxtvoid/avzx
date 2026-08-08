import { takeGraphemes, toGraphemes } from './graphemes'

export function processText(text: string | undefined): string {
  if (!text || text.trim() === '') return ''

  const trimmedText = String(text).trim()
  const words = trimmedText.split(/\s+/).filter((word) => word.length > 0)

  let result: string

  if (words.length > 1) {
    result = takeGraphemes(
      words.map((word) => toGraphemes(word)[0] ?? '').join(''),
      2
    )
  } else {
    result = takeGraphemes(trimmedText, 2)
  }

  return result.toUpperCase()
}
