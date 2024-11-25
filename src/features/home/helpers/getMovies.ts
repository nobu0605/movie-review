import 'server-only'
import { Movie } from '@/types/movie'

export async function getMovies(): Promise<Movie> {
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
