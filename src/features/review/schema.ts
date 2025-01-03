import { z } from 'zod'

export const createReviewFormSchema = z.object({
  movieId: z.number(),
  rating: z.number().int().min(0).max(5),
  comment: z.string().min(1),
})

export type CreateFormState =
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

export const deleteReviewFormSchema = z.object({
  reviewId: z.number(),
})

export type DeleteFormState =
  | {
      errors?: {
        reviewId?: string[]
        general?: string
      }
      message?: string
    }
  | undefined
