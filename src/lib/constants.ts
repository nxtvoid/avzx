import {
  gradients,
  palettes,
  patterns,
  shapes,
  styles,
  types
} from '@/zod/enums'
import { MAX_PNG_SIZE, MAX_SIZE, MIN_SIZE } from '@/lib/avatar/sanitize'

interface AvatarParam {
  name: string
  values: string
  fallback: string
}

const options = (values: readonly string[]) => values.join(' | ')

const AVATAR_PARAMS: AvatarParam[] = [
  {
    name: 'name',
    values: 'any string — path segment, required',
    fallback: '—'
  },
  { name: 'text', values: 'any string, folded to initials', fallback: '—' },
  {
    name: 'size',
    values: `${MIN_SIZE} – ${MAX_SIZE} (png caps at ${MAX_PNG_SIZE})`,
    fallback: '120'
  },
  { name: 'type', values: options(types.options), fallback: 'svg' },
  { name: 'style', values: options(styles.options), fallback: 'gradient' },
  { name: 'palette', values: options(palettes.options), fallback: 'vivid' },
  { name: 'shape', values: options(shapes.options), fallback: 'square' },
  { name: 'rounded', values: 'true | false', fallback: 'false' },
  { name: 'gradient', values: options(gradients.options), fallback: 'linear' },
  { name: 'pattern', values: options(patterns.options), fallback: 'none' },
  { name: 'color', values: 'hex, without the #', fallback: 'auto' },
  { name: 'emoji', values: 'any emoji', fallback: '—' }
]

/** Stands in for "leave this parameter out of the URL". */
const OFF = 'none'

interface PlaygroundControl {
  key: string
  label: string
  values: readonly string[]
  fallback: string
}

/**
 * Driven by the zod enums so the playground cannot offer anything the
 * endpoint would reject — the same guarantee AVATAR_PARAMS relies on.
 */
const PLAYGROUND_CONTROLS: PlaygroundControl[] = [
  {
    key: 'style',
    label: 'Style',
    values: styles.options,
    fallback: 'gradient'
  },
  {
    key: 'palette',
    label: 'Palette',
    values: palettes.options,
    fallback: 'vivid'
  },
  {
    key: 'gradient',
    label: 'Gradient',
    values: gradients.options,
    fallback: 'linear'
  },
  { key: 'shape', label: 'Shape', values: shapes.options, fallback: 'square' },
  { key: 'pattern', label: 'Pattern', values: patterns.options, fallback: OFF }
]

/**
 * Builds the path the playground previews and offers for copying. Values that
 * match their default are dropped, so what you copy stays as short as the URL
 * you would have written by hand.
 */
function buildAvatarPath(
  name: string,
  text: string,
  selected: Record<string, string>
): string {
  const search = new URLSearchParams()

  for (const control of PLAYGROUND_CONTROLS) {
    const value = selected[control.key]
    if (value && value !== control.fallback) search.set(control.key, value)
  }

  if (text.trim()) search.set('text', text.trim())

  const query = search.toString()
  const segment = encodeURIComponent(name.trim() || 'octocat')

  return `/${segment}${query ? `?${query}` : ''}`
}

export {
  AVATAR_PARAMS,
  PLAYGROUND_CONTROLS,
  buildAvatarPath,
  options,
  OFF,
  type AvatarParam,
  type PlaygroundControl
}
