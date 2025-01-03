'use server'
import {
  createReviewFormSchema,
  CreateFormState,
  deleteReviewFormSchema,
  DeleteFormState,
} from '@/features/review/schema'
import prisma from '@/utils/api/db'
import { verifySession } from '@/utils/api/jwt'

export async function createReview(
  state: CreateFormState,
  formData: FormData,
): Promise<CreateFormState> {
  const session = await verifySession()
  if (!session.isAuth || !session.userId) {
    return {
      errors: {
        general: 'Unauthorized',
      },
    }
  }

  const movieId = Number(formData.get('movieId'))
  const rating = Number(formData.get('rating'))
  if (isNaN(movieId) || isNaN(rating)) {
    return {
      errors: { movieId: ['Invalid value'] },
    }
  }

  const validatedFields = createReviewFormSchema.safeParse({
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

export async function deleteReview(
  state: DeleteFormState,
  formData: FormData,
): Promise<DeleteFormState> {
  const session = await verifySession()
  if (!session.isAuth || !session.userId) {
    return {
      errors: {
        general: 'Unauthorized',
      },
    }
  }

  const reviewId = Number(formData.get('reviewId'))
  if (isNaN(reviewId)) {
    return {
      errors: { reviewId: ['Invalid value'] },
    }
  }

  const validatedFields = deleteReviewFormSchema.safeParse({
    reviewId,
  })

  const validatedReviewId = validatedFields.data?.reviewId

  const review = await prisma.review.findUnique({
    select: {
      id: true,
      userId: true,
    },
    where: {
      id: validatedReviewId,
    },
  })

  if (review?.userId !== session.userId) {
    return {
      errors: {
        general: 'Unauthorized',
      },
    }
  }

  try {
    await prisma.review.delete({
      where: {
        id: validatedReviewId,
      },
    })
    return { message: 'Review deleted' }
  } catch (error) {
    return {
      errors: {
        general: 'An error occurred',
      },
    }
  }
}
