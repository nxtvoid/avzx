import type { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import { generateGradient } from '@/lib/gradient'
import { getAvatarParamsSchema } from '@/zod/api'
import { getSearchParamsWithArray } from '@dub/utils'

export const runtime = 'edge'
export const preferredRegion = 'auto'

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ name: string }> }
) {
  const params = await props.params
  const { name } = params

  const searchParams = getSearchParamsWithArray(req.url ?? '')
  const { text, size, type, rounded, color, pattern, emoji } =
    getAvatarParamsSchema.parse(searchParams)

  const gradient = generateGradient(name || `${Math.random()}`)
  const fontSize = (size * 0.9) / text.length
  const emojiSize = emoji ? size * 0.3 : 0
  const fromColor = color ? color : gradient.fromColor
  const toColor = color ? color : gradient.toColor

  const svgContent = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="100%" stop-color="${toColor}" />
        </linearGradient>
        ${
          rounded
            ? `
                <clipPath id="circleClip">
                  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
                </clipPath>
              `
            : ''
        }
        ${
          pattern
            ? `
                <pattern id="backgroundPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                  <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" />
                </pattern>
            `
            : ''
        }
      </defs>
      <rect 
        fill="url(#gradient)" 
        x="0" 
        y="0" 
        width="${size}" 
        height="${size}" 
        ${rounded ? 'clip-path="url(#circleClip)"' : ''}
      />

      ${
        pattern
          ? `<rect fill="url(#backgroundPattern)" x="0" y="0" width="${size}" height="${size}" ${rounded ? 'clip-path="url(#circleClip)"' : ''} />`
          : ''
      }
          
      ${
        text
          ? `
            <text
              x="50%" 
              y="${emoji ? '40%' : '50%'}" 
              alignment-baseline="central" 
              dominant-baseline="central" 
              text-anchor="middle" 
              fill="#fff" 
              font-family="sans-serif"
              font-size="${fontSize}"
              font-weight="bold"
              ${rounded ? 'clip-path="url(#circleClip)"' : ''}
            >
              ${text}
            </text>
          `
          : ''
      }
      ${
        emoji
          ? `
            <text
              x="50%" 
              y="${text ? '70%' : '50%'}" 
              alignment-baseline="central" 
              dominant-baseline="central" 
              text-anchor="middle" 
              font-size="${emojiSize}"
              ${rounded ? 'clip-path="url(#circleClip)"' : ''}
            >
              ${emoji}
            </text>
          `
          : ''
      }
    </svg>
  `

  if (type === 'svg') {
    return new Response(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=604800, immutable'
      }
    })
  }

  return new ImageResponse(
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(to bottom right, ${fromColor}, ${toColor})`,
        borderRadius: rounded ? '50%' : '0',
        overflow: 'hidden'
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
                  <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" />
                </svg>
              `)}")`,
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {text && (
        <div
          style={{
            fontSize: fontSize,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: emoji ? '10px' : '0'
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
      height: size
    }
  )
}
