/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import color from 'tinycolor2'

import { renderAvatarSvg, generateCacheKey } from '@/lib/avatar/render'
import { djb2, generateGradient } from '@/lib/avatar/gradient'
import { gradients, palettes, patterns, shapes, styles } from '@/zod/enums'

function render(
  overrides: Partial<Parameters<typeof renderAvatarSvg>[0]> = {}
) {
  const name = overrides.name ?? 'octocat'
  // Colours follow the name, the same way the route derives them.
  const { fromColor, toColor } = generateGradient(name)

  return renderAvatarSvg({
    name,
    text: '',
    size: 120,
    fromColor,
    toColor,
    ...overrides
  })
}

/** Every `url(#id)` in the document must resolve to an element defining it. */
function danglingRefs(svg: string): string[] {
  const referenced = [...svg.matchAll(/url\(#([\w-]+)\)/g)].map((m) => m[1])
  const defined = new Set(
    [...svg.matchAll(/\sid="([\w-]+)"/g)].map((m) => m[1])
  )

  return [...new Set(referenced)].filter((id) => !defined.has(id))
}

function textNodes(svg: string): string[] {
  return [...svg.matchAll(/<text[\s\S]*?>([\s\S]*?)<\/text>/g)].map((m) =>
    m[1].trim()
  )
}

function fontSizes(svg: string): number[] {
  return [...svg.matchAll(/font-size="(-?[\d.]+)"/g)].map((m) => Number(m[1]))
}

const ALL_SIZES = [16, 24, 32, 48, 64, 120, 256, 512, 1024]

describe('styles', () => {
  test('glyph renders a single character even with no text param', () => {
    const svg = render({ style: 'glyph' })
    expect(textNodes(svg)).toEqual(['O'])
  })

  test('glyph prefers the text param over the name', () => {
    const svg = render({ style: 'glyph', text: 'ZZ' })
    expect(textNodes(svg)).toEqual(['Z'])
  })

  test('glyph never emits more than one character', () => {
    for (const name of ['octocat', 'a', 'multi word name', 'ünicode']) {
      const svg = render({ style: 'glyph', name })
      const [glyph] = textNodes(svg)
      expect(glyph).toBeDefined()
      expect([...(glyph as string)]).toHaveLength(1)
    }
  })

  test('generative styles draw marks instead of initials', () => {
    for (const style of ['identicon', 'rings', 'bauhaus'] as const) {
      const svg = render({ style, text: 'OC' })
      expect(textNodes(svg)).toHaveLength(0)
      expect(svg).toContain('<rect')
    }
  })

  test('initials keeps the supplied text', () => {
    expect(textNodes(render({ style: 'initials', text: 'OC' }))).toEqual(['OC'])
  })

  test('initials derives letters from the name when no text is given', () => {
    const cases: [string, string][] = [
      ['octocat', 'OC'],
      ['john-doe', 'JD'],
      ['john_doe', 'JD'],
      ['john.doe', 'JD'],
      ['a', 'A']
    ]

    for (const [name, expected] of cases) {
      expect({
        name,
        text: textNodes(render({ style: 'initials', name }))
      }).toEqual({ name, text: [expected] })
    }
  })

  test('gradient is the default and never invents text', () => {
    // Backwards compatibility: `/name` with no params has always rendered the
    // bare gradient, so the default style must not start adding letters.
    expect(textNodes(render())).toEqual([])
    expect(textNodes(render({ style: 'gradient' }))).toEqual([])
    expect(render()).toBe(render({ style: 'gradient' }))
  })

  test('gradient still honours an explicit text param', () => {
    expect(textNodes(render({ style: 'gradient', text: 'JD' }))).toEqual(['JD'])
  })

  test('every style produces distinct output on a bare request', () => {
    const seen = new Map<string, string>()

    for (const style of styles.options) {
      const svg = render({ style })
      expect({ style, alreadySeenAs: seen.get(svg) }).toEqual({
        style,
        alreadySeenAs: undefined
      })
      seen.set(svg, style)
    }
  })

  test('gradient and initials converge once text is supplied', () => {
    // By design: the only difference between them is where the letters come
    // from, so an explicit text collapses them onto the same output.
    expect(render({ style: 'gradient', text: 'OC' })).toBe(
      render({ style: 'initials', text: 'OC' })
    )
  })

  test('generative marks are opaque', () => {
    // Translucent layers blend into muddy washes instead of reading as flat
    // geometry, which is what made the first bauhaus attempt look broken.
    for (const style of ['identicon', 'rings', 'bauhaus'] as const) {
      const svg = render({ style })
      const opacities = [...svg.matchAll(/\sopacity="([\d.]+)"/g)].map((m) =>
        Number(m[1])
      )

      expect({ style, opacities }).toEqual({ style, opacities: [] })
    }
  })

  test('generative styles vary their composition across names', () => {
    for (const style of ['identicon', 'rings', 'bauhaus'] as const) {
      const seen = new Set(
        ['alice', 'bob', 'octocat', 'vercel', 'zebra', 'mint'].map((name) =>
          render({ style, name })
        )
      )

      // Distinct names must not collapse onto one another.
      expect({ style, variants: seen.size }).toEqual({ style, variants: 6 })
    }
  })

  test('identicon is deterministic per name and differs between names', () => {
    const a1 = render({ style: 'identicon', name: 'alice' })
    const a2 = render({ style: 'identicon', name: 'alice' })
    const b = render({ style: 'identicon', name: 'bob' })

    expect(a1).toBe(a2)
    expect(a1).not.toBe(b)
  })
})

describe('gradients', () => {
  test('every gradient type defines the #gradient paint server', () => {
    for (const gradient of gradients.options) {
      expect(render({ gradientType: gradient })).toContain('id="gradient"')
    }
  })

  test('every gradient type produces distinct output', () => {
    const seen = new Set<string>()

    for (const gradient of gradients.options) {
      const svg = render({ gradientType: gradient })
      expect(seen.has(svg)).toBe(false)
      seen.add(svg)
    }
  })
})

describe('palettes', () => {
  test('every palette produces a distinct colour pair', () => {
    const seen = new Set<string>()

    for (const palette of palettes.options) {
      const { fromColor, toColor } = generateGradient('octocat', palette)
      const pair = `${fromColor}/${toColor}`
      expect(seen.has(pair)).toBe(false)
      seen.add(pair)
    }
  })

  test('vivid matches the original hardcoded formula', () => {
    // Guards backwards compatibility: every avatar minted before palettes
    // existed has to keep rendering with the exact same two colours.
    for (const name of ['octocat', 'vercel', 'a', '', 'zebra', 'xyz123']) {
      const legacy = color({ h: djb2(name) % 360, s: 0.95, l: 0.5 })
      const { fromColor, toColor } = generateGradient(name, 'vivid')

      expect(fromColor).toBe(legacy.toHexString())
      expect(toColor).toBe(legacy.triad()[1].toHexString())
    }
  })

  test('palette is deterministic', () => {
    expect(generateGradient('octocat', 'earth')).toEqual(
      generateGradient('octocat', 'earth')
    )
  })
})

describe('svg integrity', () => {
  test('no dangling url(#id) references in any combination', () => {
    for (const shape of shapes.options) {
      for (const pattern of patterns.options) {
        for (const gradient of gradients.options) {
          const svg = render({
            shape,
            pattern,
            gradientType: gradient,
            text: 'OC'
          })

          expect({
            shape,
            pattern,
            gradient,
            dangling: danglingRefs(svg)
          }).toEqual({ shape, pattern, gradient, dangling: [] })
        }
      }
    }
  })

  test('an omitted shape leaves no clip reference behind', () => {
    // `needsClipPath(undefined)` used to return true, so a render config
    // without `shape` emitted clip-path="url(#shapeClip)" with no clipPath
    // defined. The HTTP route hid it by defaulting shape before calling in.
    const svg = render()

    expect(danglingRefs(svg)).toEqual([])
    expect(svg).not.toContain('url(#shapeClip)')
  })

  test('patterns are clipped whenever the shape is not a square', () => {
    for (const shape of shapes.options) {
      for (const pattern of patterns.options) {
        const svg = render({ shape, pattern })
        const clipped = svg.split('url(#shapeClip)').length - 1

        if (shape === 'square') {
          expect(clipped).toBe(0)
        } else {
          // background layer + pattern layer
          expect(clipped).toBeGreaterThanOrEqual(2)
        }
      }
    }
  })

  test('font sizes are always positive and finite', () => {
    for (const size of ALL_SIZES) {
      for (const style of styles.options) {
        const svg = render({ size, style, text: 'OC', emoji: '🚀' })

        for (const value of fontSizes(svg)) {
          expect({ size, style, value }).toEqual({
            size,
            style,
            value: expect.any(Number)
          })
          expect(value).toBeGreaterThan(0)
          expect(Number.isFinite(value)).toBe(true)
        }
      }
    }
  })

  test('emoji scales with the avatar instead of using a fixed offset', () => {
    const small = fontSizes(render({ size: 32, emoji: '🚀' })).at(-1) as number
    const large = fontSizes(render({ size: 256, emoji: '🚀' })).at(-1) as number

    expect(small).toBeGreaterThan(0)
    expect(large / small).toBeCloseTo(8, 1)
  })

  test('text is escaped, not injected raw', () => {
    const svg = render({ text: '<script>' as string, style: 'initials' })
    expect(svg).not.toContain('<script>')
  })

  test('escaping survives truncation for name-derived text', () => {
    // Escaping before slicing splits `&lt;` into a bare `&`, which is
    // malformed XML. Every `&` emitted must open a real entity.
    const stray = /&(?!(amp|lt|gt|quot|#\d+);)/

    for (const name of ['<script>', 'a&b', '"quote', "o'brien", '&amp;']) {
      for (const style of ['glyph', 'initials'] as const) {
        const [text] = textNodes(render({ style, name }))

        expect({ name, style, stray: stray.test(text ?? '') }).toEqual({
          name,
          style,
          stray: false
        })
      }
    }
  })

  test('output stays well formed across every size', () => {
    for (const size of ALL_SIZES) {
      const svg = render({ size, text: 'OC' })
      expect(svg.startsWith('<svg')).toBe(true)
      expect(svg.trimEnd().endsWith('</svg>')).toBe(true)
      expect(svg).toContain(`viewBox="0 0 ${size} ${size}"`)
    }
  })
})

describe('graphemes', () => {
  test('flags and ZWJ sequences survive truncation', () => {
    // Slicing by UTF-16 unit cut 🇦🇷 down to a lone regional indicator and
    // reduced ZWJ sequences to their first component.
    const cases = ['🇦🇷', '👨‍👩‍👧‍👦', '👩‍💻', '🚀']

    for (const emoji of cases) {
      const [rendered] = [
        ...render({ emoji }).matchAll(/<text[\s\S]*?>([\s\S]*?)<\/text>/g)
      ].map((m) => m[1].trim())

      expect({ emoji, rendered }).toEqual({ emoji, rendered: emoji })
    }
  })

  test('name-derived initials do not split a grapheme', () => {
    expect(textNodes(render({ style: 'glyph', name: '🇦🇷argentina' }))).toEqual([
      '🇦🇷'
    ])
  })
})

describe('cache key', () => {
  test('distinguishes inputs that concatenate to the same string', () => {
    // `['a', 'b'].join('-')` and `['a-b'].join('-')` are both "a-b"; the key
    // has to keep the argument boundaries.
    expect(generateCacheKey('a', 'b')).not.toBe(generateCacheKey('a-b'))
    expect(generateCacheKey('a', undefined, 'b')).not.toBe(
      generateCacheKey('a', 'b')
    )
    expect(generateCacheKey('', 'a')).not.toBe(generateCacheKey('a'))
  })

  test('changes when any rendering parameter changes', () => {
    const base = ['octocat', 'OC', 120, 'svg', 'square', 'dots', 'linear']
    const baseline = generateCacheKey(...base)

    const variants = [
      ['other', 'OC', 120, 'svg', 'square', 'dots', 'linear'],
      ['octocat', 'XY', 120, 'svg', 'square', 'dots', 'linear'],
      ['octocat', 'OC', 256, 'svg', 'square', 'dots', 'linear'],
      ['octocat', 'OC', 120, 'png', 'square', 'dots', 'linear'],
      ['octocat', 'OC', 120, 'svg', 'hexagon', 'dots', 'linear'],
      ['octocat', 'OC', 120, 'svg', 'square', 'grid', 'linear'],
      ['octocat', 'OC', 120, 'svg', 'square', 'dots', 'radial']
    ]

    for (const variant of variants) {
      expect(generateCacheKey(...variant)).not.toBe(baseline)
    }
  })
})
