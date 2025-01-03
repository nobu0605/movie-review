import 'server-only'
import {
  Movie,
  MovieResult,
  MovieDetail,
  MovieReviewFromDB,
  Review,
} from '@/features/movie/types/movie'
import prisma from '@/utils/api/db'
import { verifySession } from '@/utils/api/jwt'

export async function getMovie(movieId: number): Promise<MovieDetail | null> {
  const session = await verifySession()
  if (!session.isAuth) return null

  const url = `https://api.themoviedb.org/3/movie/${movieId}`
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  }

  const res = await fetch(url, { ...options, cache: 'force-cache' })
  const movie: MovieResult | null = await res.json()
  if (!movie) return null

  const favorites = await prisma.favorite.findMany({
    select: {
      id: true,
      movieId: true,
      userId: true,
    },
    where: {
      movieId,
      userId: session.userId,
    },
  })

  const averageRating: MovieReviewFromDB[] = await prisma.$queryRaw`
    SELECT 
      "movieId",
      AVG("rating") AS "averageRating"
    FROM "Review"
    WHERE "movieId" = ${movieId}
    GROUP BY "movieId";
  `

  const reviews: Review[] | null = await prisma.review.findMany({
    select: {
      id: true,
      movieId: true,
      userId: true,
      user: {
        select: {
          name: true,
        },
      },
      rating: true,
      comment: true,
    },
    where: {
      movieId,
    },
  })

  const isFavorite = favorites.some((favorite) => favorite.movieId === movie.id)

  return {
    ...movie,
    isFavorite,
    averageRating: averageRating[0].averageRating.toNumber(),
    reviews: reviews,
  }
}

export async function getMovies(): Promise<MovieDetail[] | null> {
  const session = await verifySession()
  if (!session.isAuth) return null

  const url =
    'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc'
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  }

  const res = await fetch(url, { ...options, cache: 'force-cache' })
  const movie: Movie = await res.json()
  if (!movie) return null
  const movieResults = movie.results

  const movieIds: number[] = movieResults.map((movie) => movie.id)
  const favorites = await prisma.favorite.findMany({
    select: {
      id: true,
      movieId: true,
      userId: true,
    },
    where: {
      movieId: {
        in: movieIds,
      },
      userId: session.userId,
    },
  })

  const averageRatings: MovieReviewFromDB[] = await prisma.$queryRaw`
    SELECT 
      "movieId",
      AVG("rating") AS "averageRating"
    FROM "Review"
    WHERE "movieId" = ANY (ARRAY[${movieIds}]::integer[])
    GROUP BY "movieId";
  `

  const reviews: Review[] | null = await prisma.review.findMany({
    select: {
      id: true,
      comment: true,
      movieId: true,
      userId: true,
    },
    where: {
      movieId: {
        in: movieIds,
      },
    },
  })

  const movieDetails = movieResults.map((movie) => {
    const isFavorite = favorites.some((favorite) => favorite.movieId === movie.id)
    const movieReviews = reviews.filter((review) => review.movieId === movie.id)
    const averageRating = averageRatings.find((rating) => rating.movieId === movie.id)

    return {
      ...movie,
      isFavorite,
      averageRating: averageRating ? averageRating.averageRating.toNumber() : undefined,
      reviews: movieReviews,
    }
  })

  return movieDetails
}
