export function sanitizeSvgText(input: string | undefined): string {
  if (!input) return ''

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function clampSize(size: number, min = 16, max = 1024): number {
  return Math.min(Math.max(size, min), max)
}
