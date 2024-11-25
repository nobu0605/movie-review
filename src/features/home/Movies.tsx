import Image from 'next/image'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getMovies } from '@/features/home/helpers/getMovies'
import { Movie, Result } from '@/types/movie'

export async function Movies() {
  const movies: Movie = await getMovies()

  return (
    <div className='p-4'>
      <h1 className='text-4xl'>Movies</h1>
      <ul className='flex flex-wrap gap-8 p-4'>
        {movies.results.map((movie: Result) => (
          <div key={movie.id}>
            <Card className='w-[380px]'>
              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
                <CardDescription>{movie.overview}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  width={100}
                  height={350}
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt=''
                />
                <p className='mt-3'>Vote average: {movie.vote_average}</p>
                <p>Vote count: {movie.vote_count}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </ul>
    </div>
  )
}
