import { z } from 'zod'

export const booleanQuerySchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true')
  .describe('A boolean query schema that coerces the value to a boolean')
