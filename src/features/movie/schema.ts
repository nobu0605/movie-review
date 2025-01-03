import { z } from 'zod'

export const searchParamsSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
})

export const pathParamsSchema = z.object({
  movieId: z.string().regex(/^\d+$/).transform(Number),
})
