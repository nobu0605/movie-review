import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Favorite } from '@/features/favorite/components/Favorite'
import { MovieDetail } from '@/features/movie/types/movie'
import { ReviewDialog } from '@/features/review/components/ReviewDialog'
import { StarRating } from '@/features/review/components/StarRating'
import { User } from '@/features/user/types/user'

type Props = {
  movie: MovieDetail
  className?: string
  user: User
}

export async function MovieCard({ movie, className, user }: Props) {
  const averageRating = movie.averageRating
  const unreviewed = movie.reviews.every((review) => review.userId !== user.id)

  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader>
          <Link href={`/movie/${movie.id}`}>
            <CardTitle>{movie.title}</CardTitle>
          </Link>
          <div className='flex direction-row gap-2'>
            <span>Rating {averageRating}</span>
            <StarRating className='mr-6' rating={averageRating} />
            <Link href={`/movie/${movie.id}#reviews`} className='text-linkBlue'>
              {movie.reviews.length}
            </Link>
          </div>
          <CardDescription>{movie.overview}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <Link href={`/movie/${movie.id}`}>
            <Image
              className='min-h-[300px] mx-auto'
              width={200}
              height={300}
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
            />
          </Link>
          <div className='flex direction-row gap-2'>
            <span>Favorite</span>
            <Favorite movieId={movie.id} isFavorite={movie.isFavorite} />
          </div>
          {unreviewed && <ReviewDialog movieId={movie.id} />}
        </CardContent>
      </Card>
    </div>
  )
}
