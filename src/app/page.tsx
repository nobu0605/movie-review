import React from 'react'
import { Movies } from '@/features/movie/components/Movies'
import { getMovies } from '@/features/movie/helpers/movie'
import { getUser } from '@/features/user/helpers/user'

export default async function Home() {
  const user = await getUser()
  const movies = await getMovies()
  if (!movies || !user) return <span>no data</span>

  return (
    <div>
      <Movies movies={movies} user={user} />
    </div>
  )
}
