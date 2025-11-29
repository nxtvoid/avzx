import type { PatternType } from '@/zod/enums'

interface PatternConfig {
  color: string
  opacity?: number
}

export function generatePatternDef(
  pattern: PatternType,
  config: PatternConfig
): string {
  const { color, opacity = 0.15 } = config

  if (!pattern) return ''

  if (pattern === 'dots') {
    return `
      <pattern id="bgPattern" patternUnits="userSpaceOnUse" width="20" height="20">
        <circle cx="10" cy="10" r="2" fill="${color}" opacity="${opacity}" />
      </pattern>
    `
  }

  if (pattern === 'grid') {
    return `
      <pattern id="bgPattern" patternUnits="userSpaceOnUse" width="20" height="20">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${color}" stroke-width="0.5" opacity="${opacity}" />
      </pattern>
    `
  }

  if (pattern === 'stripes') {
    return `
      <pattern id="bgPattern" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="10" stroke="${color}" stroke-width="2" opacity="${opacity}" />
      </pattern>
    `
  }

  if (pattern === 'noise') {
    return `
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise"/>
        <feColorMatrix type="saturate" values="0"/>
        <feBlend in="SourceGraphic" in2="noise" mode="multiply"/>
      </filter>
    `
  }

  return ''
}

export function generatePatternElement(
  pattern: PatternType,
  size: number,
  rounded: boolean
): string {
  if (!pattern) return ''

  if (pattern === 'noise') {
    return `<rect 
      x="0" y="0" 
      width="${size}" height="${size}" 
      fill="rgba(255,255,255,0.03)" 
      filter="url(#noiseFilter)"
      ${rounded ? 'clip-path="url(#circleClip)"' : ''}
    />`
  }

  return `<rect 
    fill="url(#bgPattern)" 
    x="0" y="0" 
    width="${size}" height="${size}" 
    ${rounded ? 'clip-path="url(#circleClip)"' : ''}
  />`
}
