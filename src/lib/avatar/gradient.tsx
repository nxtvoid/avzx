import type { GradientType, PaletteType } from '@/zod/enums'
import color from 'tinycolor2'

export function djb2(str: string) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
  }
  return hash
}

interface GradientColors {
  fromColor: string
  toColor: string
}

interface GradientConfig {
  fromColor: string
  toColor: string
  size: number
}

interface Palette {
  saturation: number
  lightness: number
  /** Hue distance between the two stops, in degrees. */
  spread: number
  /** Lightness delta applied to the second stop. */
  shift: number
}

// `vivid` reproduces the original hardcoded values (s 0.95 / l 0.5 / triad),
// so existing avatars keep rendering byte-for-byte the same.
const PALETTES: Record<NonNullable<PaletteType>, Palette> = {
  vivid: { saturation: 0.95, lightness: 0.5, spread: 120, shift: 0 },
  pastel: { saturation: 0.5, lightness: 0.78, spread: 55, shift: -0.06 },
  earth: { saturation: 0.38, lightness: 0.46, spread: 35, shift: 0.1 },
  mono: { saturation: 0.35, lightness: 0.42, spread: 0, shift: 0.3 },
  neon: { saturation: 1, lightness: 0.55, spread: 165, shift: 0 }
}

export function generateGradient(
  username: string,
  palette?: PaletteType
): GradientColors {
  const { saturation, lightness, spread, shift } = PALETTES[palette ?? 'vivid']

  const hash = djb2(username)
  const from = color({ h: hash % 360, s: saturation, l: lightness })

  const to = color({
    h: (from.toHsl().h + spread) % 360,
    s: saturation,
    l: Math.min(0.95, Math.max(0.05, lightness + shift))
  })

  return { fromColor: from.toHexString(), toColor: to.toHexString() }
}

// SVG has no conic paint server, so it gets approximated with wedges fanned
// out from the centre. `<pattern>` is used as the carrier because it is a
// paint server that accepts arbitrary child geometry, which keeps the caller
// contract intact: everything still resolves through `url(#gradient)`.
const CONIC_STEPS = 32

function generateConicDef(from: string, to: string, size: number): string {
  const half = size / 2
  // Must clear the corners: half * sqrt(2) ≈ 0.707 * size.
  const radius = size * 0.75
  const wedges: string[] = []

  for (let i = 0; i < CONIC_STEPS; i++) {
    const t = i / CONIC_STEPS
    // Ramp out and back so the seam at 360° closes on the same colour.
    const amount = (t <= 0.5 ? t * 2 : (1 - t) * 2) * 100
    const fill = color.mix(from, to, amount).toHexString()

    const a0 = t * 2 * Math.PI - Math.PI / 2
    // Overrun into the next wedge: abutting edges leave antialiasing hairlines
    // that read as white spokes, so neighbours are made to overlap instead.
    const a1 = ((i + 1.4) / CONIC_STEPS) * 2 * Math.PI - Math.PI / 2

    const x0 = (half + radius * Math.cos(a0)).toFixed(2)
    const y0 = (half + radius * Math.sin(a0)).toFixed(2)
    const x1 = (half + radius * Math.cos(a1)).toFixed(2)
    const y1 = (half + radius * Math.sin(a1)).toFixed(2)

    wedges.push(
      `<path d="M ${half} ${half} L ${x0} ${y0} L ${x1} ${y1} Z" fill="${fill}" stroke="${fill}" stroke-width="1" />`
    )
  }

  return `
    <pattern id="gradient" patternUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}">
      ${wedges.join('')}
    </pattern>
  `
}

function generateMeshDef(from: string, to: string, size: number): string {
  const mid = color.mix(from, to, 50).toHexString()

  const blobs = [
    { cx: '20%', cy: '25%', r: '75%', fill: from },
    { cx: '85%', cy: '20%', r: '65%', fill: to },
    { cx: '75%', cy: '85%', r: '80%', fill: mid },
    { cx: '15%', cy: '90%', r: '70%', fill: to }
  ]

  const stops = blobs
    .map(
      (blob, i) => `
        <radialGradient id="meshBlob${i}" cx="${blob.cx}" cy="${blob.cy}" r="${blob.r}">
          <stop offset="0%" stop-color="${blob.fill}" stop-opacity="1" />
          <stop offset="100%" stop-color="${blob.fill}" stop-opacity="0" />
        </radialGradient>`
    )
    .join('')

  const layers = blobs
    .map(
      (_, i) =>
        `<rect width="${size}" height="${size}" fill="url(#meshBlob${i})" />`
    )
    .join('')

  return `
    ${stops}
    <pattern id="gradient" patternUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="${mid}" />
      ${layers}
    </pattern>
  `
}

export function generateGradientDef(
  type: GradientType,
  config: GradientConfig
): string {
  const { fromColor, toColor, size } = config

  switch (type) {
    case 'radial':
      return `
        <radialGradient id="gradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="100%" stop-color="${toColor}" />
        </radialGradient>
      `
    case 'conic':
      return generateConicDef(fromColor, toColor, size)
    case 'mesh':
      return generateMeshDef(fromColor, toColor, size)
    default:
      return `
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="100%" stop-color="${toColor}" />
        </linearGradient>
      `
  }
}

export function mixColors(from: string, to: string): string {
  return color.mix(from, to, 50).toHexString()
}

export function getContrastTextColor(bgColor: string): string {
  const c = color(bgColor)
  return c.isLight() ? '#000000' : '#ffffff'
}
