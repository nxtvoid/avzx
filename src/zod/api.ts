import { z } from 'zod'
import { processText } from '@/lib/process-text'
import { booleanQuerySchema } from './misc'
import { validateHTMLColorHex } from 'validate-color'
import { gradients, patterns, shapes, sources, types } from './enums'

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

export const getAvatarParamsSchema = AvatarParamsSchema.merge(
  z.object({
    rounded: booleanQuerySchema
      .optional()
      .default('false')
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
        return val.length > 2 ? val.slice(0, 2) : val
      }),
    shape: z
      .enum(shapes.options)
      .optional()
      .describe('The shape of the avatar'),
    gradient: z.enum(gradients.options).optional().describe('The gradient type')
  })
)
