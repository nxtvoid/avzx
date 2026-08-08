import type { NextRequest } from 'next/server'
import { after } from 'next/server'
import { track } from '@vercel/analytics/server'
import { ImageResponse } from 'next/og'
import { generateGradient } from '@/lib/avatar/gradient'
import { getAvatarParamsSchema } from '@/zod/api'
import { getSearchParamsWithArray } from '@/lib/functions/urls'
import {
  clampSize,
  MAX_PNG_SIZE,
  MAX_SIZE,
  MIN_SIZE
} from '@/lib/avatar/sanitize'
import {
  generateCacheKey,
  getAvatarHeaders,
  renderAvatarSvg
} from '@/lib/avatar/render'

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ name: string }> }
) {
  const params = await props.params
  const { name } = params

  const parsed = getAvatarParamsSchema.safeParse(
    getSearchParamsWithArray(req.url ?? '')
  )

  if (!parsed.success) {
    return Response.json(
      {
        error: 'Invalid query parameters',
        issues: parsed.error.issues.map((issue) => ({
          param: issue.path.join('.'),
          message: issue.message
        }))
      },
      { status: 400 }
    )
  }

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
    gradient,
    palette,
    style
  } = parsed.data

  const size = clampSize(
    rawSize,
    MIN_SIZE,
    type === 'png' ? MAX_PNG_SIZE : MAX_SIZE
  )
  const gradientData = generateGradient(name || `${Math.random()}`, palette)

  const fromColor = color ? color : gradientData.fromColor
  const toColor = color ? color : gradientData.toColor
  const shape = rounded ? 'circle' : shapeParam || 'square'

  if (source === 'external') {
    after(
      track('avatar_generated', {
        named: name ? 'yes' : 'no',
        text: text ? 'yes' : 'no',
        size,
        type,
        shape,
        pattern: pattern || 'empty',
        emoji: emoji ? 'yes' : 'no',
        color: color ? 'custom' : 'gradient',
        gradient: gradient || 'empty',
        palette,
        style
      }).catch(() => {})
    )
  }

  const cacheKey = generateCacheKey(
    name,
    text,
    size,
    type,
    shape,
    String(pattern),
    String(gradient),
    palette,
    style,
    emoji,
    color
  )

  const svgContent = renderAvatarSvg({
    name,
    text,
    size,
    fromColor,
    toColor,
    shape,
    pattern,
    gradientType: gradient,
    style,
    emoji
  })

  if (type === 'svg') {
    return new Response(svgContent, {
      headers: getAvatarHeaders('svg', cacheKey)
    })
  }

  const svgDataUri = `data:image/svg+xml;base64,${Buffer.from(svgContent, 'utf-8').toString('base64')}`

  return new ImageResponse(
    // biome-ignore lint/performance/noImgElement: consumed by Satori, which rasterises to a buffer and does not understand next/image.
    <img width={size} height={size} alt={text || name} src={svgDataUri} />,
    {
      width: size,
      height: size,
      headers: getAvatarHeaders('png', cacheKey)
    }
  )
}
