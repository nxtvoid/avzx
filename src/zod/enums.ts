import { z } from 'zod'

const sources = z.enum(['self', 'external'])
const types = z.enum(['svg', 'png'])
const patterns = z.enum(['dots', 'grid', 'stripes', 'noise'])
const shapes = z.enum(['circle', 'square', 'squircle', 'hexagon'])
const gradients = z.enum(['linear', 'radial', 'conic', 'mesh'])

type SourceType = z.infer<typeof sources> | undefined
type TypeType = z.infer<typeof types> | undefined
type PatternType = z.infer<typeof patterns> | undefined
type ShapeType = z.infer<typeof shapes> | undefined
type GradientType = z.infer<typeof gradients> | undefined

export { sources, types, patterns, shapes, gradients }
export type { SourceType, TypeType, PatternType, ShapeType, GradientType }
