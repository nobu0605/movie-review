import { z } from 'zod'

export const reviewFormSchema = z.object({
  movieId: z.number(),
  rating: z.number().int().min(0).max(5),
  comment: z.string().min(1),
})

export type FormState =
  | {
      errors?: {
        movieId?: string[]
        rating?: string[]
        comment?: string[]
        general?: string
      }
      message?: string
    }
  | undefined
