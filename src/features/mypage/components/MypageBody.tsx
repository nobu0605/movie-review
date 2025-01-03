import { MovieCard } from '@/features/movie/components/MovieCard'
import { MovieDetail } from '@/features/movie/types/movie'
import { User } from '@/features/user/types/user'

type Props = {
  favoriteMovies: MovieDetail[] | null
  user: User | null
}

export function MypageBody({ favoriteMovies, user }: Props) {
  if (!favoriteMovies || !user) {
    return <span className='text-center'>Data not found</span>
  }

  return (
    <div className='flex flex-col gap-8 p-4'>
      {favoriteMovies.map((movie) => (
        <MovieCard
          className='sm:w-[50%] w-[100%] mx-auto'
          key={movie.id}
          movie={movie}
          user={user}
        />
      ))}
    </div>
  )
}
