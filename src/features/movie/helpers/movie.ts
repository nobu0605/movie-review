import 'server-only'
import { Movie, Result, MovieDetail, MovieReviewFromDB } from '@/types/movie'
import prisma from '@/utils/api/db'
import { verifySession } from '@/utils/api/jwt'

export async function getMovies(): Promise<Movie | null> {
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
  const data = await res.json()

  return data
}

export async function getMovieDetails(movieResults: Result[]): Promise<MovieDetail[] | null> {
  const session = await verifySession()
  if (!session.isAuth) return null

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

  const reviews: MovieReviewFromDB[] = await prisma.$queryRaw`
    SELECT 
      "movieId",
      AVG("rating") AS "averageRating",
      ARRAY_AGG("comment") AS "comments"
    FROM "Review"
    WHERE "movieId" = ANY (ARRAY[${movieIds}]::integer[])
    GROUP BY "movieId";
  `

  const movieDetails = movieResults.map((movie) => {
    const isFavorite = favorites.some((favorite) => favorite.movieId === movie.id)
    const movieReviews = reviews
      .filter((review) => review.movieId === movie.id)
      .map((review) => ({
        averageRating: review.averageRating.toNumber(),
        comments: review.comments,
        movieId: review.movieId,
      }))
    return {
      ...movie,
      isFavorite,
      reviews: movieReviews[0],
    }
  })

  return movieDetails
}
