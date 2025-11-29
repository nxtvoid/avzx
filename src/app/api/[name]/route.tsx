import type { NextRequest } from 'next/server'

import { track } from '@vercel/analytics/server'
import { ImageResponse } from 'next/og'
import { generateGradient } from '@/lib/gradient'
import { getAvatarParamsSchema } from '@/zod/api'
import { clampSize } from '@/lib/avatar/sanitize'
import { getContrastTextColor } from '@/lib/avatar/gradient'
import { getSearchParamsWithArray } from '@/lib/functions/urls'
import {
  generateCacheKey,
  getAvatarHeaders,
  renderAvatarSvg
} from '@/lib/avatar/render'

export const preferredRegion = 'auto'

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ name: string }> }
) {
  const params = await props.params
  const { name } = params

  const {
    source,
    text,
    size: rawSize,
    type,
    rounded,
    color,
    pattern,
    emoji,
    shape: shapeParam,
    gradient
  } = getAvatarParamsSchema.parse(getSearchParamsWithArray(req.url ?? ''))

  const size = clampSize(rawSize)
  const gradientData = generateGradient(name || `${Math.random()}`)

  const fromColor = color ? color : gradientData.fromColor
  const toColor = color ? color : gradientData.toColor
  const shape = rounded ? 'circle' : shapeParam || 'square'

  if (source === 'external') {
    await track('avatar_generated', {
      name: name || 'empty',
      text: text || 'empty',
      size,
      type,
      shape,
      pattern: pattern || 'empty',
      emoji: emoji ? 'yes' : 'no',
      color: color ? 'custom' : 'gradient',
      gradient: gradient || 'empty'
    })
  }

  const cacheKey = generateCacheKey(
    name,
    text,
    size,
    type,
    shape,
    String(pattern),
    emoji,
    color
  )

  if (type === 'svg') {
    const svgContent = renderAvatarSvg({
      name,
      text,
      size,
      fromColor,
      toColor,
      shape,
      pattern,
      gradientType: gradient,
      emoji
    })

    return new Response(svgContent, {
      headers: getAvatarHeaders('svg', cacheKey)
    })
  }

  const fontSize = text.length <= 2 ? size * 0.4 : (size * 0.9) / text.length
  const emojiSize = emoji ? size * 0.3 : 0
  const textColor = getContrastTextColor(fromColor)

  const borderRadius =
    shape === 'circle' ? '50%' : shape === 'squircle' ? '25%' : '0'

  return new ImageResponse(
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          gradient === 'radial'
            ? `radial-gradient(circle at 30% 30%, ${fromColor}, ${toColor})`
            : `linear-gradient(to bottom right, ${fromColor}, ${toColor})`,
        borderRadius,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {pattern && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="2" fill="${textColor}" opacity="0.15" />
              </svg>
            `)}")`,
            backgroundSize: '20px 20px'
          }}
        />
      )}
      {text && (
        <div
          style={{
            fontSize,
            fontWeight: 600,
            color: textColor,
            marginBottom: emoji ? '8px' : '0',
            letterSpacing: '-0.02em'
          }}
        >
          {text}
        </div>
      )}
      {emoji && (
        <div
          style={{
            fontSize: emojiSize,
            lineHeight: 1
          }}
        >
          {emoji}
        </div>
      )}
    </div>,
    {
      width: size,
      height: size,
      headers: getAvatarHeaders('png', cacheKey)
    }
  )
}
