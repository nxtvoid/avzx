import type {
  GradientType,
  PatternType,
  ShapeType,
  StyleType
} from '@/zod/enums'
import { sanitizeSvgText, clampSize } from './sanitize'
import { generateShapeClipPath, needsClipPath } from './shapes'
import { generatePatternDef, generatePatternElement } from './patterns'
import {
  djb2,
  generateGradientDef,
  getContrastTextColor,
  mixColors
} from './gradient'
import { generateStyleBody, styleBackdrop, styleText } from './styles'

export interface AvatarRenderConfig {
  name: string
  text: string
  size: number
  fromColor: string
  toColor: string
  shape?: ShapeType
  pattern?: PatternType
  gradientType?: GradientType
  style?: StyleType
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
    name,
    text,
    size: rawSize,
    fromColor,
    toColor,
    shape,
    pattern,
    gradientType,
    style,
    emoji,
    fontFamily = 'system-ui, -apple-system, sans-serif'
  } = config

  const size = clampSize(rawSize)
  const sanitizedEmoji = emoji ? sanitizeSvgText(emoji) : ''
  // Generative styles draw their own marks, so the initials are dropped;
  // `glyph` keeps a single character. Escaping happens *after* truncation —
  // slicing an already-escaped string splits entities like `&lt;` into a bare
  // `&`, which is malformed XML.
  const sanitizedText = sanitizeSvgText(styleText(style, text, name))

  const fontSize =
    style === 'glyph'
      ? size * 0.58
      : calculateFontSize(size, sanitizedText.length)
  const emojiSize = emoji ? size * 0.24 : 0
  // Text over a gradient has to be measured against the midpoint, not against
  // either end — flat-background styles are measured against the field itself.
  const textColor = getContrastTextColor(
    styleBackdrop(style, fromColor, mixColors(fromColor, toColor))
  )
  const patternColor = textColor === '#ffffff' ? '#ffffff' : '#000000'

  const useClipPath = needsClipPath(shape)
  const clipPathAttr = useClipPath ? 'clip-path="url(#shapeClip)"' : ''

  const styleBody = generateStyleBody(style, {
    size,
    hash: djb2(name),
    fromColor,
    toColor,
    contrastColor: textColor,
    clipAttr: clipPathAttr
  })

  return `<svg
    width="${size}"
    height="${size}"
    viewBox="0 0 ${size} ${size}"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      ${generateGradientDef(gradientType, { fromColor, toColor, size })}
      ${useClipPath ? generateShapeClipPath(shape, size) : ''}
      ${generatePatternDef(pattern, { color: patternColor })}
    </defs>

    ${styleBody}

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
        font-size="${emojiSize}"
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
