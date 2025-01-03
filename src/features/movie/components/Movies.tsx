import React from 'react'
import { MovieCard } from '@/features/movie/components/MovieCard'
import { MoviesPagination } from '@/features/movie/components/MoviesPagination'
import { MovieDetail } from '@/features/movie/types/movie'
import { User } from '@/features/user/types/user'

type Props = {
  movies: MovieDetail[]
  user: User
  page: number
}

export async function Movies({ movies, user, page }: Props) {
  return (
    <div className='p-4'>
      <h1 className='text-4xl'>Movies</h1>
      <ul className='flex flex-wrap gap-8 p-4'>
        {movies.map((movie: MovieDetail) => (
          <MovieCard className='sm:w-[23%] w-[100%]' key={movie.id} movie={movie} user={user} />
        ))}
      </ul>
      <MoviesPagination page={page} />
    </div>
  )
}
