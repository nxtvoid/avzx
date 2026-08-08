import type { StyleType } from '@/zod/enums'
import { takeGraphemes } from '@/lib/graphemes'

export interface StyleContext {
  size: number
  /** Deterministic seed derived from the avatar name. */
  hash: number
  fromColor: string
  toColor: string
  /** Readable against the gradient midpoint. */
  contrastColor: string
  /** Empty string when the shape needs no clipping. */
  clipAttr: string
}

/** Styles that draw their own marks instead of the name's initials. */
const GENERATIVE_STYLES: StyleType[] = ['identicon', 'rings', 'bauhaus']

function styleShowsText(style: StyleType): boolean {
  return !GENERATIVE_STYLES.includes(style)
}

/**
 * Names are usually slugs, so separators count as word breaks: `john-doe`
 * gives JD rather than JO.
 */
function initialsFromName(name: string): string {
  const words = name.split(/[\s\-_.]+/).filter(Boolean)

  if (words.length === 0) return ''
  if (words.length === 1) return takeGraphemes(words[0], 2).toUpperCase()

  return words
    .slice(0, 2)
    .map((word) => takeGraphemes(word, 1))
    .join('')
    .toUpperCase()
}

/**
 * `gradient` only shows what the caller passed — it is the default, and
 * deriving letters there would change how every existing avatar renders.
 * `initials` and `glyph` fall back to the name, otherwise those styles
 * degrade to a blank field, which is never what the caller wanted.
 */
export function styleText(
  style: StyleType,
  text: string,
  name: string
): string {
  if (!styleShowsText(style)) return ''

  if (style === 'glyph')
    return takeGraphemes((text || name).trim(), 1).toUpperCase()
  if (style === 'initials') return text || initialsFromName(name)

  return text
}

/** Styles painted on the gradient itself rather than on a flat field. */
const GRADIENT_STYLES: StyleType[] = [undefined, 'gradient', 'initials']

/**
 * Contrast has to be measured against whatever actually sits behind the text:
 * the gradient midpoint for gradient-backed styles, the flat field otherwise.
 */
export function styleBackdrop(
  style: StyleType,
  fromColor: string,
  midColor: string
): string {
  return GRADIENT_STYLES.includes(style) ? midColor : fromColor
}

function gradientBackground({ size, clipAttr }: StyleContext): string {
  return `<rect fill="url(#gradient)" x="0" y="0" width="${size}" height="${size}" ${clipAttr} />`
}

function flatBackground(ctx: StyleContext): string {
  const { size, fromColor, clipAttr } = ctx
  return `<rect fill="${fromColor}" x="0" y="0" width="${size}" height="${size}" ${clipAttr} />`
}

/**
 * 5x5 grid mirrored across the vertical axis, the classic identicon layout.
 * Only the left three columns are drawn from the hash; the outer two mirror
 * them, which is what makes the result read as a deliberate mark.
 */
function renderIdenticon(ctx: StyleContext): string {
  const { size, hash, toColor, clipAttr } = ctx
  const cell = size / 5
  const cells: string[] = []

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      if (((hash >> (row * 3 + col)) & 1) === 0) continue

      const y = (row * cell).toFixed(2)
      const columns = col === 2 ? [2] : [col, 4 - col]

      for (const target of columns) {
        cells.push(
          `<rect x="${(target * cell).toFixed(2)}" y="${y}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="${toColor}" />`
        )
      }
    }
  }

  return `${flatBackground(ctx)}<g ${clipAttr}>${cells.join('')}</g>`
}

function renderRings(ctx: StyleContext): string {
  const { size, hash, fromColor, toColor, contrastColor, clipAttr } = ctx
  const seed = Math.abs(hash)
  const half = size / 2

  // Ring count alone gave only three possible compositions, so the centre
  // offset and the colour order vary too.
  const count = 3 + (seed % 4)
  const cx = half + size * (((seed >> 4) % 3) - 1) * 0.12
  const cy = half + size * (((seed >> 6) % 3) - 1) * 0.12
  const inverted = (seed >> 8) % 2 === 0
  const palette = inverted
    ? [toColor, fromColor, contrastColor]
    : [fromColor, toColor, contrastColor]

  const rings = Array.from({ length: count }, (_, i) => {
    const radius = (size * 0.62 * (count - i)) / count
    return `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${radius.toFixed(2)}" fill="${palette[i % palette.length]}" />`
  })

  return `${flatBackground(ctx)}<g ${clipAttr}>${rings.join('')}</g>`
}

/**
 * Flat geometric composition: a rotated half-plane split, a disc, and a bar.
 * Every mark is fully opaque — layering translucent shapes just muddies the
 * colours instead of reading as geometry.
 */
function renderBauhaus(ctx: StyleContext): string {
  const { size, hash, fromColor, toColor, contrastColor, clipAttr } = ctx
  const seed = Math.abs(hash)
  const half = size / 2
  const pivot = `${half} ${half}`

  // Oversized so it still covers the frame once rotated.
  const splitAngle = (seed % 4) * 45
  const split = `<rect x="${-half}" y="${half}" width="${size * 2}" height="${size * 2}" fill="${toColor}" transform="rotate(${splitAngle} ${pivot})" />`

  const cx = size * (seed % 2 === 0 ? 0.34 : 0.66)
  const cy = size * ((seed >> 3) % 2 === 0 ? 0.34 : 0.66)
  const disc = `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(size * 0.24).toFixed(2)}" fill="${contrastColor}" />`

  const barAngle = ((seed >> 5) % 4) * 45 + 22.5
  const barThickness = size * 0.11
  const bar = `<rect x="${-half}" y="${(half - barThickness / 2).toFixed(2)}" width="${size * 2}" height="${barThickness.toFixed(2)}" fill="${fromColor}" transform="rotate(${barAngle} ${pivot})" />`

  return `${flatBackground(ctx)}<g ${clipAttr}>${split}${disc}${bar}</g>`
}

export function generateStyleBody(style: StyleType, ctx: StyleContext): string {
  switch (style) {
    case 'identicon':
      return renderIdenticon(ctx)
    case 'rings':
      return renderRings(ctx)
    case 'bauhaus':
      return renderBauhaus(ctx)
    case 'glyph':
      return flatBackground(ctx)
    default:
      return gradientBackground(ctx)
  }
}
