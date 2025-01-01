'use server'
import { FormState, favoriteFormSchema } from '@/features/favorite/schema'
import prisma from '@/utils/api/db'
import { verifySession } from '@/utils/api/jwt'

export async function favor(state: FormState, formData: FormData): Promise<FormState> {
  const movieIdRaw = formData.get('movieId')
  const movieId = Number(movieIdRaw)
  if (isNaN(movieId)) {
    return {
      errors: { movieId: ['Invalid movie ID'] },
    }
  }

  const session = await verifySession()
  if (!session.isAuth || !session.userId) {
    return { message: 'Unauthorized' }
  }

  const validatedFields = favoriteFormSchema.safeParse({
    movieId,
  })

  if (!validatedFields.success) {
    return {
      errors: { movieId: validatedFields.error.flatten().fieldErrors.movieId },
    }
  }

  try {
    await prisma.favorite.create({
      data: {
        userId: session.userId,
        movieId: validatedFields.data.movieId,
      },
    })
  } catch (error) {
    return { message: 'An error occurred' }
  }
}

export async function disfavor(state: FormState, formData: FormData): Promise<FormState> {
  const movieIdRaw = formData.get('movieId')
  const movieId = Number(movieIdRaw)
  if (isNaN(movieId)) {
    return {
      errors: { movieId: ['Invalid movie ID'] },
    }
  }

  const session = await verifySession()
  if (!session.isAuth || !session.userId) {
    return { message: 'Unauthorized' }
  }
  const userId = session.userId

  const validatedFields = favoriteFormSchema.safeParse({
    movieId,
  })

  if (!validatedFields.success) {
    return {
      errors: { movieId: validatedFields.error.flatten().fieldErrors.movieId },
    }
  }

  try {
    await prisma.favorite.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    })
  } catch (error) {
    return { message: 'An error occurred' }
  }
}
