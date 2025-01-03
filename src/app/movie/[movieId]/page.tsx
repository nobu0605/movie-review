import { MovieDetail } from '@/features/movie/components/MovieDetail'
import { getMovie } from '@/features/movie/helpers/movie'
import { pathParamsSchema } from '@/features/movie/schema'
import { getUser } from '@/features/user/helpers/user'

type MoviePageProps = {
  params: Promise<{
    movieId: string
  }>
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const pathParams = await params
  const parsedSearchParams = pathParamsSchema.safeParse(pathParams)
  if (!parsedSearchParams.success) {
    return <p>Error: Invalid path parameter.</p>
  }

  const user = await getUser()
  const movie = await getMovie(parsedSearchParams.data.movieId)
  if (!movie || !user) {
    return <span>Movie not found</span>
  }

  return (
    <div className='flex flex-col gap-4 justify-center'>
      <div className='mt-4'>
        <h1 className='text-4xl font-bold text-center'>Movie Detail</h1>
      </div>
      <MovieDetail movie={movie} user={user} />
    </div>
  )
}
