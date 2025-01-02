'use server'
import { reviewFormSchema, FormState } from '@/features/review/schema'
import prisma from '@/utils/api/db'
import { verifySession } from '@/utils/api/jwt'

export async function review(state: FormState, formData: FormData): Promise<FormState> {
  const movieId = Number(formData.get('movieId'))
  const rating = Number(formData.get('rating'))
  if (isNaN(movieId) || isNaN(rating)) {
    return {
      errors: { movieId: ['Invalid value'] },
    }
  }

  const session = await verifySession()
  if (!session.isAuth || !session.userId) {
    return {
      errors: {
        general: 'Unauthorized',
      },
    }
  }

  const validatedFields = reviewFormSchema.safeParse({
    movieId,
    rating,
    comment: formData.get('comment'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await prisma.review.create({
      data: {
        userId: session.userId,
        movieId: validatedFields.data.movieId,
        rating: validatedFields.data.rating,
        comment: validatedFields.data.comment,
      },
    })
    return { message: 'Review submitted' }
  } catch (error) {
    return {
      errors: {
        general: 'An error occurred',
      },
    }
  }
}
