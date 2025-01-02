import React from 'react'
import { MovieCard } from '@/features/movie/components/MovieCard'
import { getMovies, getMovieDetails } from '@/features/movie/helpers/movie'
import { Movie, MovieDetail } from '@/types/movie'

export async function Movies() {
  const movies: Movie | null = await getMovies()
  if (!movies) return <span>no data</span>

  const movieDetails = await getMovieDetails(movies.results)
  if (!movieDetails) return <span>no data</span>

  return (
    <div className='p-4'>
      <h1 className='text-4xl'>Movies</h1>
      <ul className='flex flex-wrap gap-8 p-4'>
        {movieDetails.map((movie: MovieDetail) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ul>
    </div>
  )
}
