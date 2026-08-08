import { z } from 'zod'

const sources = z.enum(['self', 'external'])
const types = z.enum(['svg', 'png'])
const patterns = z.enum(['dots', 'grid', 'stripes', 'noise'])
const shapes = z.enum(['circle', 'square', 'squircle', 'hexagon'])
const gradients = z.enum(['linear', 'radial', 'conic', 'mesh'])
const palettes = z.enum(['vivid', 'pastel', 'earth', 'mono', 'neon'])
const styles = z.enum([
  'gradient',
  'initials',
  'identicon',
  'rings',
  'bauhaus',
  'glyph'
])

type SourceType = z.infer<typeof sources> | undefined
type TypeType = z.infer<typeof types> | undefined
type PatternType = z.infer<typeof patterns> | undefined
type ShapeType = z.infer<typeof shapes> | undefined
type GradientType = z.infer<typeof gradients> | undefined
type PaletteType = z.infer<typeof palettes> | undefined
type StyleType = z.infer<typeof styles> | undefined

export { sources, types, patterns, shapes, gradients, palettes, styles }
export type {
  SourceType,
  TypeType,
  PatternType,
  ShapeType,
  GradientType,
  PaletteType,
  StyleType
}
