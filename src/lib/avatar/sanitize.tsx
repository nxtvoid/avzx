export function sanitizeSvgText(input: string | undefined): string {
  if (!input) return ''

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export const MIN_SIZE = 16
export const MAX_SIZE = 1024
/**
 * PNG goes through Satori and resvg, so cost grows with the pixel count in a
 * way SVG does not — a 1024px render with `noise` is the expensive path on a
 * public endpoint. Vector output keeps the full range.
 */
export const MAX_PNG_SIZE = 512

export function clampSize(
  size: number,
  min = MIN_SIZE,
  max = MAX_SIZE
): number {
  return Math.min(Math.max(size, min), max)
}
