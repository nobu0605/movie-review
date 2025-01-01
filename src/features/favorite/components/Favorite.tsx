'use client'
import { StarIcon } from '@heroicons/react/24/solid'
import { useActionState, useState } from 'react'
import { favor, disfavor } from '@/features/favorite/serverActions/favorite'

type Props = {
  isFavorite: boolean
  movieId: number
}

export function Favorite({ isFavorite, movieId }: Props) {
  const [state, action, isPending] = useActionState(isFavorite ? disfavor : favor, undefined)
  const [isFavoriteState, setIsFavoriteState] = useState<boolean>(isFavorite)

  return (
    <form action={action}>
      <input type='hidden' name='movieId' value={movieId} />
      <button
        type='submit'
        onClick={() => setIsFavoriteState(!isFavoriteState)}
        disabled={isPending}
      >
        <StarIcon className={`h-6 w-6 ${isFavoriteState ? 'text-yellow-500' : 'text-gray-300'}`} />
      </button>
      {state?.errors?.movieId && <p className='text-sm text-red-500'>{state.errors.movieId}</p>}
    </form>
  )
}
