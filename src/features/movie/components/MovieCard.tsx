import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Favorite } from '@/features/favorite/components/Favorite'
import { ReviewDialog } from '@/features/review/components/ReviewDialog'
import { StarRating } from '@/features/review/components/StarRating'
import { MovieDetail } from '@/types/movie'

type Props = {
  movie: MovieDetail
}

export function MovieCard({ movie }: Props) {
  const averageRating = movie.reviews?.averageRating

  return (
    <div className='sm:w-[23%] w-[100%]' key={movie.id}>
      <Card>
        <CardHeader>
          <CardTitle>{movie.title}</CardTitle>
          <div className='flex direction-row gap-2'>
            <span>Rating {averageRating}</span>
            <StarRating className='mr-6' rating={averageRating} />
            <Link href='/' className='text-linkBlue'>
              {movie.reviews?.comments.length}
            </Link>
          </div>
          <CardDescription>{movie.overview}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <Image
            className='min-h-[300px]'
            width={200}
            height={300}
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
          />
          <div className='flex direction-row gap-2'>
            <span>Favorite</span>
            <Favorite movieId={movie.id} isFavorite={movie.isFavorite} />
          </div>
          <ReviewDialog movieId={movie.id} />
        </CardContent>
      </Card>
    </div>
  )
}
