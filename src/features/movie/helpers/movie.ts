import 'server-only'
import { Movie, Result, MovieDetail } from '@/types/movie'
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

  const res = await fetch(url, options)
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
    },
  })

  const movieDetails = movieResults.map((movie) => {
    const isFavorite = favorites.some((favorite) => favorite.movieId === movie.id)
    return { ...movie, isFavorite }
  })

  return movieDetails
}
