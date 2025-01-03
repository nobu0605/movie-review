import { z } from 'zod'

export const favoriteFormSchema = z.object({
  movieId: z.number(),
})

export type FormState =
  | {
      errors?: {
        movieId?: string[]
        general?: string
      }
      message?: string
    }
  | undefined
