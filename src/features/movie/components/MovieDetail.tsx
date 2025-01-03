import { MovieCard } from '@/features/movie/components/MovieCard'
import { MovieDetail as MovieDetailType } from '@/features/movie/types/movie'
import { ReviewCard } from '@/features/review/components/ReviewCard'
import { User } from '@/features/user/types/user'

type Props = {
  movie: MovieDetailType
  user: User
}

export async function MovieDetail({ movie, user }: Props) {
  return (
    <div className='flex justify-center flex-col gap-4 mb-8'>
      <MovieCard className='mx-auto sm:w-[50%] w-[100%]' movie={movie} user={user} />
      <span className='mx-auto text-3xl mt-4'>Reviews</span>
      {movie.reviews?.map((review) => (
        <ReviewCard
          className='sm:w-[50%] w-[100%] mx-auto'
          key={review.id}
          review={review}
          user={user}
        />
      ))}
    </div>
  )
}
