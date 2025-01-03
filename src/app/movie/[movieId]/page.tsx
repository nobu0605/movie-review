import { MovieDetail } from '@/features/movie/components/MovieDetail'
import { getMovie } from '@/features/movie/helpers/movie'
import { getUser } from '@/features/user/helpers/user'

type MoviePageProps = {
  params: Promise<{
    movieId: string
  }>
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { movieId } = await params
  const movieIdNumber = Number(movieId)
  if (isNaN(movieIdNumber)) {
    return <span>Invalid movie ID</span>
  }
  const user = await getUser()
  const movie = await getMovie(movieIdNumber)
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
