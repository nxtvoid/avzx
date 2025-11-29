import type { GradientType, PatternType, ShapeType } from '@/zod/enums'
import { sanitizeSvgText, clampSize } from './sanitize'
import { generateShapeClipPath, needsClipPath } from './shapes'
import { generatePatternDef, generatePatternElement } from './patterns'
import { generateGradientDef, getContrastTextColor } from './gradient'

export interface AvatarRenderConfig {
  name: string
  text: string
  size: number
  fromColor: string
  toColor: string
  shape?: ShapeType
  pattern?: PatternType
  gradientType?: GradientType
  emoji?: string
  fontFamily?: string
}

function calculateFontSize(size: number, textLength: number): number {
  // if (textLength <= 1) return size * 0.5
  // if (textLength <= 2) return size * 0.3

  return Math.max(
    size * 0.2,
    (size * 0.9) / Math.log2(textLength + 2) / textLength
  )
}

export function renderAvatarSvg(config: AvatarRenderConfig): string {
  const {
    text,
    size: rawSize,
    fromColor,
    toColor,
    shape,
    pattern,
    gradientType,
    emoji,
    fontFamily = 'system-ui, -apple-system, sans-serif'
  } = config

  const size = clampSize(rawSize)
  const sanitizedText = sanitizeSvgText(text)
  const sanitizedEmoji = emoji ? sanitizeSvgText(emoji) : ''

  const fontSize = calculateFontSize(size, sanitizedText.length)
  const emojiSize = emoji ? size * 0.3 : 0
  const textColor = getContrastTextColor(fromColor)
  const patternColor = textColor === '#ffffff' ? '#ffffff' : '#000000'

  const useClipPath = needsClipPath(shape)
  const clipPathAttr = useClipPath ? 'clip-path="url(#shapeClip)"' : ''

  return `<svg 
    width="${size}" 
    height="${size}" 
    viewBox="0 0 ${size} ${size}" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      ${generateGradientDef(gradientType, { fromColor, toColor })}
      ${useClipPath ? generateShapeClipPath(shape, size) : ''}
      ${generatePatternDef(pattern, { color: patternColor })}
    </defs>
    
    <rect 
      fill="url(#gradient)"
      x="0" y="0"
      width="${size}" height="${size}"
      ${clipPathAttr}
    />
    
    ${generatePatternElement(pattern, size, useClipPath)}
    
    ${
      sanitizedText
        ? `
        <text
            x="50%"
             y="${sanitizedEmoji ? '40%' : '50%'}"
            alignment-baseline="central"
            dominant-baseline="central"
            text-anchor="middle"
            fill="${textColor}"
            font-family="${fontFamily}"
            font-size="${fontSize}"
            font-weight="600"
            ${clipPathAttr}
        >${sanitizedText}</text>
        `
        : ''
    }
    
    ${
      sanitizedEmoji
        ? `
      <text
        x="50%"
        y="${sanitizedText ? '70%' : '50%'}"
        alignment-baseline="central"
        dominant-baseline="central"
        text-anchor="middle"
        font-size="${emojiSize - 15}"
        ${clipPathAttr}
      >${sanitizedEmoji}</text>
    `
        : ''
    }
  </svg>`
}

export function getAvatarHeaders(
  type: 'svg' | 'png',
  cacheKey?: string
): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': type === 'svg' ? 'image/svg+xml' : 'image/png',
    'Cache-Control':
      'public, max-age=31536000, stale-while-revalidate=86400, immutable',
    'CDN-Cache-Control': 'max-age=31536000',
    'Vercel-CDN-Cache-Control': 'max-age=31536000'
  }

  if (cacheKey) {
    headers.ETag = `"${cacheKey}"`
  }

  return headers
}

export function generateCacheKey(
  ...args: (string | number | boolean | undefined)[]
): string {
  const str = args.filter(Boolean).join('-')
  let hash = 5381

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
  }

  return Math.abs(hash).toString(36)
}
