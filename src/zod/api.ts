import { z } from 'zod'
import { DEFAULT_AVATAR_CONFIG } from '@/lib/constants'
import { booleanQuerySchema } from './misc'
import { validateHTMLColorHex } from 'validate-color'
import { processText } from '@/lib/api/process-text'

const AvatarParamsSchema = z.object({
  text: z
    .string()
    .optional()
    .default(DEFAULT_AVATAR_CONFIG.text)
    .transform(processText)
    .describe('The text to display on the avatar'),
  size: z
    .string()
    .optional()
    .default(DEFAULT_AVATAR_CONFIG.size.toString())
    .transform((val) => {
      const parsed = parseInt(val, 10)
      if (Number.isNaN(parsed)) return DEFAULT_AVATAR_CONFIG.size
      return parsed <= 0 ? DEFAULT_AVATAR_CONFIG.size : parsed
    })
    .pipe(z.number().int().positive())
    .describe(
      'The size of the avatar (positive integer, defaults to 120 if invalid)'
    ),
  type: z
    .enum(['svg', 'png'])
    .optional()
    .default(DEFAULT_AVATAR_CONFIG.type)
    .describe('The file type of the avatar')
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
    pattern: booleanQuerySchema
      .optional()
      .default('false')
      .describe('A dot pattern is added to the background of the avatar.'),
    emoji: z
      .string()
      .optional()
      .describe('An emoji to use as the avatar')
      .transform((val) => {
        if (!val) return undefined
        return val.length > 2 ? val.slice(0, 2) : val
      })
  })
)
