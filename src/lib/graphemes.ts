const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/**
 * Splits on user-perceived characters rather than UTF-16 units.
 *
 * `slice`/`charAt` cut a flag (`🇦🇷`, four units) down to a lone regional
 * indicator and reduce ZWJ sequences — families, professions — to their first
 * component, which renders as a different glyph than the one that was asked
 * for.
 */
export function toGraphemes(value: string): string[] {
  return [...segmenter.segment(value)].map((entry) => entry.segment)
}

/** `slice(0, count)` counted in graphemes. */
export function takeGraphemes(value: string, count: number): string {
  return toGraphemes(value).slice(0, count).join('')
}
