import React from 'react'
import { Movies } from '@/features/movie/components/Movies'
import { getMovies } from '@/features/movie/helpers/movie'
import { searchParamsSchema } from '@/features/movie/schema'
import { getUser } from '@/features/user/helpers/user'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams
  const parsedSearchParams = searchParamsSchema.safeParse(params)
  if (!parsedSearchParams.success) {
    return <p>Error: Invalid search parameters.</p>
  }
  const page = parsedSearchParams.data.page || 1

  const user = await getUser()
  const movies = await getMovies(page)
  if (!movies || !user) return <span>no data</span>

  return (
    <div>
      <Movies movies={movies} user={user} page={page} />
    </div>
  )
}
