import { z } from 'zod'
import { processText } from '@/lib/process-text'
import { takeGraphemes } from '@/lib/graphemes'
import { booleanQuerySchema } from './misc'
import { validateHTMLColorHex } from 'validate-color'
import {
  gradients,
  palettes,
  patterns,
  shapes,
  sources,
  styles,
  types
} from './enums'

const AvatarParamsSchema = z.object({
  text: z
    .string()
    .optional()
    .transform(processText)
    .describe('The text to display on the avatar'),
  size: z
    .string()
    .optional()
    .default('120')
    .transform((val) => {
      const parsed = Number.parseInt(val, 10)
      if (Number.isNaN(parsed)) return 120
      return parsed <= 0 ? 120 : parsed
    })
    .pipe(z.number().int().positive())
    .describe('The size of the avatar'),
  type: z
    .enum(types.options)
    .optional()
    .default('svg')
    .describe('The file type of the avatar'),
  source: z
    .enum(sources.options)
    .default('external')
    .describe('The source of the avatar')
})

export const getAvatarParamsSchema = AvatarParamsSchema.extend({
  rounded: booleanQuerySchema
    .optional()
    .default(false)
    .describe('Whether the avatar should be rounded'),
  color: z
    .string()
    .optional()
    .describe('A hex color to use for the avatar')
    .transform((val) => {
      if (!val) return undefined
      const hex = `#${val}`
      if (!validateHTMLColorHex(hex)) return undefined
      return hex
    }),
  pattern: z
    .enum(patterns.options)
    .optional()
    .describe('The pattern to overlay on the avatar'),
  emoji: z
    .string()
    .optional()
    .describe('An emoji to use as the avatar')
    .transform((val) => {
      if (!val) return undefined
      // One grapheme, not two UTF-16 units: slicing splits flags and ZWJ
      // sequences into fragments that render as a different glyph.
      return takeGraphemes(val, 1) || undefined
    }),
  shape: z.enum(shapes.options).optional().describe('The shape of the avatar'),
  gradient: z.enum(gradients.options).optional().describe('The gradient type'),
  palette: z
    .enum(palettes.options)
    .optional()
    .default('vivid')
    .describe('The colour range used to derive the gradient'),
  style: z
    .enum(styles.options)
    .optional()
    .default('gradient')
    .describe('The kind of avatar to generate')
})
