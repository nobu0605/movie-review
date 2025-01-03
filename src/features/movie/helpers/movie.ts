import 'server-only'
import { Prisma } from '@prisma/client'
import {
  Movie,
  MovieResult,
  MovieDetail,
  AverageRating,
  Review,
  Favorite,
} from '@/features/movie/types/movie'
import prisma from '@/utils/api/db'
import { verifySession } from '@/utils/api/jwt'

const movieRequestOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
}

export async function getMovie(movieId: number): Promise<MovieDetail | null> {
  const session = await verifySession()
  if (!session.isAuth || !session.userId) return null

  const url = `https://api.themoviedb.org/3/movie/${movieId}`
  const res = await fetch(url, { ...movieRequestOptions, cache: 'force-cache' })
  const movie: MovieResult | null = await res.json()
  if (!movie) return null

  const favorites = await getFavorites(session.userId, movieId)
  const averageRating: AverageRating[] = await getAverageRatings(movieId)
  const reviews: Review[] = await prisma.review.findMany({
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
  const averageRatingNumber = averageRating[0]
    ? Math.ceil(averageRating[0].averageRating.toNumber() * 10) / 10
    : undefined

  return {
    ...movie,
    isFavorite,
    averageRating: averageRatingNumber,
    reviews: reviews,
  }
}

export async function getMovies(page: number): Promise<MovieDetail[] | null> {
  const session = await verifySession()
  if (!session.isAuth || !session.userId) return null

  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`
  const res = await fetch(url, { ...movieRequestOptions, cache: 'force-cache' })
  const movie: Movie = await res.json()
  if (!movie) return null
  const movieResults = movie.results

  const movieIds: number[] = movieResults.map((movie) => movie.id)
  const favorites = await getFavorites(session.userId, undefined, movieIds)
  const averageRatings: AverageRating[] = await getAverageRatings(movieIds)
  const reviews: Review[] = await getMovieReviews(movieIds)
  const movieDetails = buildMovieDetails(movieResults, favorites, reviews, averageRatings)

  return movieDetails
}

export async function getFavoriteMovies(): Promise<MovieDetail[] | null> {
  const session = await verifySession()
  if (!session.isAuth || !session.userId) return null

  const favorites = await getFavorites(session.userId)
  const favoriteMovieIds = favorites.map((favorite) => favorite.movieId)
  let favoriteMovies: MovieResult[] = []

  try {
    const movieRequests = favoriteMovieIds.map((movieId) =>
      fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
        ...movieRequestOptions,
        cache: 'force-cache',
      }).then((res) => res.json()),
    )
    favoriteMovies = await Promise.all(movieRequests)
  } catch (error) {
    console.error('Error fetching movies:', error)
  }

  if (favoriteMovies.length === 0) return null

  const averageRatings: AverageRating[] = await getAverageRatings(favoriteMovieIds)
  const reviews: Review[] | null = await getMovieReviews(favoriteMovieIds)
  const movieDetails = buildMovieDetails(favoriteMovies, favorites, reviews, averageRatings)

  return movieDetails
}

async function getAverageRatings(movieIdOrIds: number | number[]): Promise<AverageRating[]> {
  const condition = Prisma.sql`${
    Array.isArray(movieIdOrIds)
      ? Prisma.sql`"movieId" = ANY (ARRAY[${movieIdOrIds}]::integer[])`
      : Prisma.sql`"movieId" = ${movieIdOrIds}`
  }`

  const averageRatings: AverageRating[] = await prisma.$queryRaw`
    SELECT 
      "movieId",
      AVG("rating") AS "averageRating"
    FROM "Review"
    WHERE ${condition}
    GROUP BY "movieId";
  `

  return averageRatings
}

async function getMovieReviews(movieIds: number[]): Promise<Review[]> {
  const reviews: Review[] = await prisma.review.findMany({
    select: {
      id: true,
      movieId: true,
      userId: true,
    },
    where: {
      movieId: {
        in: movieIds,
      },
    },
  })

  return reviews
}

function buildMovieDetails(
  movies: MovieResult[],
  favorites: Favorite[],
  reviews: Review[],
  averageRatings: AverageRating[],
): MovieDetail[] {
  const movieDetails = movies.map((movie) => {
    const isFavorite = favorites.some((favorite) => favorite.movieId === movie.id)
    const movieReviews = reviews.filter((review) => review.movieId === movie.id)
    const averageRating = averageRatings.find((rating) => rating.movieId === movie.id)
    const averageRatingNumber = averageRating
      ? Math.ceil(averageRating.averageRating.toNumber() * 10) / 10
      : undefined

    return {
      ...movie,
      isFavorite,
      averageRating: averageRatingNumber,
      reviews: movieReviews,
    }
  })

  return movieDetails
}

async function getFavorites(
  userId: number,
  movieId?: number,
  movieIds?: number[],
): Promise<Favorite[]> {
  const whereClause: Record<string, unknown> = { userId }

  if (movieId) {
    whereClause.movieId = movieId
  } else if (movieIds) {
    whereClause.movieId = { in: movieIds }
  }

  return prisma.favorite.findMany({
    select: {
      id: true,
      movieId: true,
      userId: true,
    },
    where: whereClause,
  })
}
