/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import type { NextRequest } from 'next/server'

import { GET } from '@/app/api/[name]/route'
import { AVATAR_PARAMS } from '@/lib/constants'
import { DATA_EXAMPLES } from '@/lib/data'
import { styles } from '@/zod/enums'

/**
 * Keeps `/docs` honest. Everything here compares what the page claims against
 * what the endpoint actually does, so documentation cannot silently drift out
 * of sync with the implementation.
 */

async function request(path: string) {
  const [name, query = ''] = path.replace(/^\//, '').split('?')
  const params = new URLSearchParams(query)
  // Keeps the analytics call out of the test run.
  params.set('source', 'self')

  return GET({ url: `https://avzx.test/${name}?${params}` } as NextRequest, {
    params: Promise.resolve({ name: decodeURIComponent(name) })
  })
}

/** Strips the origin so examples can be replayed against the handler. */
function toPath(url: string) {
  return url.replace(/^https?:\/\/[^/]+/, '')
}

/** Values that describe behaviour rather than naming a literal default. */
const PROSE_DEFAULTS = ['—', 'required', 'auto', 'none']

describe('/docs examples', () => {
  test('every card URL is a valid request', async () => {
    for (const example of DATA_EXAMPLES) {
      const response = await request(toPath(example.url))

      expect({ id: example.id, status: response.status }).toEqual({
        id: example.id,
        status: 200
      })
    }
  })

  test('both tabs have content', () => {
    // The page splits on the `new` badge; an empty tab renders a blank panel.
    const basic = DATA_EXAMPLES.filter((e) => e.badge !== 'new')
    const advanced = DATA_EXAMPLES.filter((e) => e.badge === 'new')

    expect(basic.length).toBeGreaterThan(0)
    expect(advanced.length).toBeGreaterThan(0)
  })

  test('card ids are unique', () => {
    const ids = DATA_EXAMPLES.map((example) => example.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every card documents params the endpoint actually accepts', async () => {
    const documented = new Set(AVATAR_PARAMS.map((param) => param.name))

    for (const example of DATA_EXAMPLES) {
      for (const param of example.params ?? []) {
        expect({ id: example.id, key: param.key, documented: true }).toEqual({
          id: example.id,
          key: param.key,
          documented: documented.has(param.key)
        })
      }
    }
  })
})

describe('/docs parameter table', () => {
  test('every documented default is the actual default', async () => {
    const bare = await (await request('/octocat')).text()

    for (const param of AVATAR_PARAMS) {
      if (PROSE_DEFAULTS.includes(param.fallback)) continue

      const explicit = await (
        await request(`/octocat?${param.name}=${param.fallback}`)
      ).text()

      // Passing the documented default must be a no-op.
      expect({ param: param.name, matchesBare: true }).toEqual({
        param: param.name,
        matchesBare: explicit === bare
      })
    }
  })

  test('every documented value is accepted', async () => {
    for (const param of AVATAR_PARAMS) {
      if (!param.values.includes('|')) continue

      for (const value of param.values.split('|').map((v) => v.trim())) {
        const response = await request(`/octocat?${param.name}=${value}`)

        expect({ param: param.name, value, status: response.status }).toEqual({
          param: param.name,
          value,
          status: 200
        })
      }
    }
  })

  test('the table covers every style the enum exposes', () => {
    const row = AVATAR_PARAMS.find((param) => param.name === 'style')
    const listed = row?.values.split('|').map((v) => v.trim())

    expect(listed).toEqual([...styles.options])
  })

  test('the documented size range matches the clamp', async () => {
    const row = AVATAR_PARAMS.find((param) => param.name === 'size')
    const [, min, max, pngMax] = (row?.values ?? '').match(
      /(\d+)\s*–\s*(\d+).*?(\d+)/
    ) as RegExpMatchArray

    expect(await (await request(`/octocat?size=${+min - 1}`)).text()).toContain(
      `viewBox="0 0 ${min} ${min}"`
    )
    expect(await (await request(`/octocat?size=${+max + 1}`)).text()).toContain(
      `viewBox="0 0 ${max} ${max}"`
    )

    // The documented png ceiling has to be the one the route enforces.
    const png = await request(`/octocat?type=png&size=${+max}`)
    const bytes = new Uint8Array(await png.arrayBuffer())
    // IHDR width lives in bytes 16..19, big endian.
    const width = new DataView(bytes.buffer).getUint32(16)

    expect(width).toBe(Number(pngMax))
  })
})
