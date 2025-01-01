import Image from 'next/image'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Favorite } from '@/features/favorite/components/Favorite'
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
          <div className='sm:w-[23%] w-[100%]' key={movie.id}>
            <Card>
              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
                <CardDescription>{movie.overview}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  className='min-h-[300px]'
                  width={200}
                  height={300}
                  placeholder='blur'
                  blurDataURL='/example-blur.jpg'
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                />
                <p className='mt-3'>Vote average: {movie.vote_average}</p>
                <p>Vote count: {movie.vote_count}</p>
                <Favorite movieId={movie.id} isFavorite={movie.isFavorite} />
              </CardContent>
            </Card>
          </div>
        ))}
      </ul>
    </div>
  )
}
