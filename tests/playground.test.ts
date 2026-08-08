/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import type { NextRequest } from 'next/server'

import { GET } from '@/app/api/[name]/route'
import { buildAvatarPath, OFF, PLAYGROUND_CONTROLS } from '@/lib/constants'

/** Every control left on its default. */
const DEFAULTS = Object.fromEntries(
  PLAYGROUND_CONTROLS.map((control) => [control.key, control.fallback])
)

function build(
  overrides: Record<string, string> = {},
  name = 'octocat',
  text = ''
) {
  return buildAvatarPath(name, text, { ...DEFAULTS, ...overrides })
}

async function statusOf(path: string) {
  const [name, query = ''] = path.replace(/^\//, '').split('?')
  const params = new URLSearchParams(query)
  params.set('source', 'self')

  const response = await GET(
    { url: `https://avzx.test/${name}?${params}` } as NextRequest,
    { params: Promise.resolve({ name: decodeURIComponent(name) }) }
  )

  return response.status
}

describe('playground url builder', () => {
  test('drops every parameter left on its default', () => {
    expect(build()).toBe('/octocat')
  })

  test('includes only the parameters that were changed', () => {
    expect(build({ style: 'rings' })).toBe('/octocat?style=rings')
    expect(build({ style: 'rings', shape: 'circle' })).toBe(
      '/octocat?style=rings&shape=circle'
    )
  })

  test('treats the pattern sentinel as absent', () => {
    expect(build({ pattern: OFF })).toBe('/octocat')
    expect(build({ pattern: 'dots' })).toBe('/octocat?pattern=dots')
  })

  test('adds text only when it is not blank', () => {
    expect(build({}, 'octocat', '   ')).toBe('/octocat')
    expect(build({}, 'octocat', ' JD ')).toBe('/octocat?text=JD')
  })

  test('encodes names that need it', () => {
    expect(build({}, 'a b')).toBe('/a%20b')
    expect(build({}, 'a/b')).toBe('/a%2Fb')
    expect(build({}, '<script>')).toBe('/%3Cscript%3E')
  })

  test('falls back to a sample name when the field is emptied', () => {
    expect(build({}, '  ')).toBe('/octocat')
  })
})

describe('playground controls', () => {
  test('every control default is a real default or the off sentinel', () => {
    for (const control of PLAYGROUND_CONTROLS) {
      const valid =
        control.fallback === OFF || control.values.includes(control.fallback)

      expect({ key: control.key, valid }).toEqual({
        key: control.key,
        valid: true
      })
    }
  })

  test('every option the playground offers is accepted by the endpoint', async () => {
    for (const control of PLAYGROUND_CONTROLS) {
      for (const value of control.values) {
        const path = build({ [control.key]: value })

        expect({
          key: control.key,
          value,
          status: await statusOf(path)
        }).toEqual({ key: control.key, value, status: 200 })
      }
    }
  })

  test('every produced URL round-trips through the endpoint', async () => {
    const combos: Record<string, string>[] = [
      { style: 'identicon', shape: 'circle' },
      { style: 'glyph', palette: 'earth' },
      { style: 'rings', pattern: 'noise', shape: 'hexagon' },
      { gradient: 'mesh', pattern: 'grid', palette: 'neon' }
    ]

    for (const combo of combos) {
      const path = build(combo)
      expect({ path, status: await statusOf(path) }).toEqual({
        path,
        status: 200
      })
    }
  })
})
