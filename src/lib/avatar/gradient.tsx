import type { GradientType } from '@/zod/enums'
import color from 'tinycolor2'

export function djb2(str: string) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
  }
  return hash
}

interface GradientConfig {
  fromColor: string
  toColor: string
  angle?: number
}

export function generateGradient(username: string): GradientConfig {
  const hash = djb2(username)
  const c1 = color({ h: hash % 360, s: 0.95, l: 0.5 })
  const second = c1.triad()[1].toHexString()

  return {
    fromColor: c1.toHexString(),
    toColor: second,
    angle: (hash % 90) + 45
  }
}

export function generateGradientDef(
  type: GradientType,
  config: GradientConfig
): string {
  const { fromColor, toColor } = config

  switch (type) {
    case 'radial':
      return `
        <radialGradient id="gradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="100%" stop-color="${toColor}" />
        </radialGradient>
      `
    case 'conic':
      return `
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="50%" stop-color="${toColor}" />
          <stop offset="100%" stop-color="${fromColor}" />
        </linearGradient>
      `
    default:
      return `
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="100%" stop-color="${toColor}" />
        </linearGradient>
      `
  }
}

export function getContrastTextColor(bgColor: string): string {
  const c = color(bgColor)
  return c.isLight() ? '#000000' : '#ffffff'
}
