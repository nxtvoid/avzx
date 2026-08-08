/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import type { NextRequest } from 'next/server'

import { GET } from '@/app/api/[name]/route'

/**
 * Exercises the whole request path — query parsing, schema defaults, render —
 * without booting a server. `source=self` is always set so the analytics call
 * is skipped.
 */
async function get(name: string, query = '') {
  const url = `https://avzx.test/${name}?source=self${query ? `&${query}` : ''}`

  return GET({ url } as NextRequest, {
    params: Promise.resolve({ name })
  })
}

async function svg(name: string, query = '') {
  const response = await get(name, query)
  return response.text()
}

function textNodes(body: string): string[] {
  return [...body.matchAll(/<text[\s\S]*?>([\s\S]*?)<\/text>/g)].map((m) =>
    m[1].trim()
  )
}

describe('GET /api/[name]', () => {
  test('defaults to a 120px svg', async () => {
    const response = await get('octocat')

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('image/svg+xml')
    expect(await response.text()).toContain('viewBox="0 0 120 120"')
  })

  test('style=glyph renders a letter with no text param', async () => {
    // Regression: this used to return a flat coloured square.
    expect(textNodes(await svg('avatar', 'style=glyph'))).toEqual(['A'])
  })

  test('the bare endpoint still renders only a gradient', async () => {
    // The documented default. Adding letters here would change every avatar
    // already embedded elsewhere.
    expect(textNodes(await svg('vercel'))).toEqual([])
    expect(await svg('vercel')).toBe(await svg('vercel', 'style=gradient'))
  })

  test('style=initials reads the letters off the name', async () => {
    expect(textNodes(await svg('john-doe', 'style=initials'))).toEqual(['JD'])
    expect(textNodes(await svg('vercel', 'style=initials'))).toEqual(['VE'])
  })

  test('every style is reachable through the query string', async () => {
    const bodies = new Set<string>()

    for (const style of [
      'gradient',
      'initials',
      'identicon',
      'rings',
      'bauhaus',
      'glyph'
    ]) {
      // No text param: that is where the styles actually differ from one
      // another. With an explicit text, gradient and initials converge.
      const body = await svg('octocat', `style=${style}`)
      expect({ style, duplicate: bodies.has(body) }).toEqual({
        style,
        duplicate: false
      })
      bodies.add(body)
    }
  })

  test('every palette is reachable through the query string', async () => {
    const bodies = new Set<string>()

    for (const palette of ['vivid', 'pastel', 'earth', 'mono', 'neon']) {
      const body = await svg('octocat', `palette=${palette}`)
      expect(bodies.has(body)).toBe(false)
      bodies.add(body)
    }
  })

  test('every gradient is reachable through the query string', async () => {
    const bodies = new Set<string>()

    for (const gradient of ['linear', 'radial', 'conic', 'mesh']) {
      const body = await svg('octocat', `gradient=${gradient}`)
      expect(bodies.has(body)).toBe(false)
      bodies.add(body)
    }
  })

  test('rejects unknown enum values with 400 and names the param', async () => {
    for (const [param, value] of [
      ['style', 'bogus'],
      ['palette', 'nope'],
      ['shape', 'blob'],
      ['gradient', 'zzz'],
      ['pattern', 'plaid'],
      ['type', 'gif']
    ]) {
      const response = await get('octocat', `${param}=${value}`)
      expect(response.status).toBe(400)

      const body = (await response.json()) as {
        issues: { param: string }[]
      }
      expect(body.issues.map((issue) => issue.param)).toContain(param)
    }
  })

  test('reports every invalid param at once', async () => {
    const response = await get('octocat', 'style=bogus&shape=blob')
    const body = (await response.json()) as { issues: { param: string }[] }

    expect(body.issues.map((issue) => issue.param).sort()).toEqual([
      'shape',
      'style'
    ])
  })

  test('size is clamped to the documented range', async () => {
    expect(await svg('octocat', 'size=1')).toContain('viewBox="0 0 16 16"')
    expect(await svg('octocat', 'size=99999')).toContain(
      'viewBox="0 0 1024 1024"'
    )
  })

  test('png is capped below the svg ceiling', async () => {
    // Rasterising costs more than emitting vectors, so the public endpoint
    // keeps the expensive path smaller. SVG still goes to 1024.
    expect(await svg('octocat', 'size=1024')).toContain(
      'viewBox="0 0 1024 1024"'
    )

    const png = await get('octocat', 'type=png&size=1024')
    const bytes = new Uint8Array(await png.arrayBuffer())

    expect(new DataView(bytes.buffer).getUint32(16)).toBe(512)
  })

  test('invalid colours are rejected instead of silently ignored', async () => {
    // A typo used to return 200 with the generated gradient, so the mistake
    // rendered as a perfectly plausible avatar. `%23ff0000` is `#ff0000`,
    // which becomes `##ff0000` once the leading hash is added back.
    for (const value of ['red', 'zzz', '12345', '%23ff0000', 'ff00zz']) {
      const response = await get('octocat', `color=${value}`)
      expect({ value, status: response.status }).toEqual({ value, status: 400 })

      const body = (await response.json()) as { issues: { param: string }[] }
      expect(body.issues.map((issue) => issue.param)).toContain('color')
    }
  })

  test('every hex shorthand the validator accepts still works', async () => {
    // 3, 4, 6 and 8 digit forms are all legitimate hex — rejecting them would
    // have been a regression dressed up as stricter validation.
    for (const [value, expected] of [
      ['6366f1', '#6366f1'],
      ['fff', '#fff'],
      ['FFF', '#FFF'],
      ['ffff', '#ffff'],
      ['ffffffff', '#ffffffff']
    ]) {
      const body = await svg('octocat', `color=${value}`)
      expect({ value, applied: body.includes(expected) }).toEqual({
        value,
        applied: true
      })
    }
  })

  test('non-numeric size falls back to the default', async () => {
    expect(await svg('octocat', 'size=abc')).toContain('viewBox="0 0 120 120"')
  })

  test('text is folded to initials', async () => {
    expect(textNodes(await svg('octocat', 'text=John Doe'))).toEqual(['JD'])
  })

  test('rounded=true wins over shape', async () => {
    const rounded = await svg('octocat', 'rounded=true&shape=hexagon')
    expect(rounded).toContain('<circle')
  })

  test('ETag distinguishes every rendering param', async () => {
    const etags = new Set<string>()

    for (const query of [
      '',
      'text=OC',
      'size=256',
      'shape=hexagon',
      'pattern=grid',
      'gradient=radial',
      'palette=earth',
      'style=rings',
      'emoji=%F0%9F%9A%80',
      'color=6366f1'
    ]) {
      const etag = (await get('octocat', query)).headers.get('ETag')
      expect(etag).toBeTruthy()
      expect(etags.has(etag as string)).toBe(false)
      etags.add(etag as string)
    }
  })

  test('png bodies actually materialise', async () => {
    // Regression: the handler returned an ImageResponse whose body threw
    // InvalidCharacterError while streaming, so asserting on `status` alone
    // reported success for a request that died on the wire. Every case here
    // has to be read to the last byte.
    const cases = [
      'type=png',
      'type=png&text=AB',
      'type=png&emoji=%F0%9F%9A%80',
      'type=png&emoji=%F0%9F%87%A6%F0%9F%87%B7',
      'type=png&emoji=%F0%9F%9A%80&text=AB',
      'type=png&text=%C3%9C%C3%91',
      'type=png&style=identicon',
      'type=png&pattern=noise&shape=hexagon'
    ]

    for (const query of cases) {
      const response = await get('octocat', query)
      const bytes = new Uint8Array(await response.arrayBuffer())

      expect({
        query,
        status: response.status,
        // PNG magic number.
        signature: [...bytes.slice(0, 4)]
      }).toEqual({ query, status: 200, signature: [137, 80, 78, 71] })
    }
  }, 30_000)

  test('svg bodies are non-empty for every style', async () => {
    for (const style of ['gradient', 'initials', 'identicon', 'glyph']) {
      const body = await svg('octocat', `style=${style}`)
      expect({ style, ends: body.trimEnd().endsWith('</svg>') }).toEqual({
        style,
        ends: true
      })
    }
  })

  test('responses are cacheable', async () => {
    const cacheControl = (await get('octocat')).headers.get('Cache-Control')
    expect(cacheControl).toContain('immutable')
  })
})
