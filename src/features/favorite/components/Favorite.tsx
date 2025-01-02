'use client'
import { StarIcon } from '@heroicons/react/24/solid'
import { useActionState, useState } from 'react'
import { favorAction } from '@/features/favorite/serverActions/favorite'

type Props = {
  isFavorite: boolean
  movieId: number
}

export function Favorite({ isFavorite, movieId }: Props) {
  const [isFavoriteState, setIsFavoriteState] = useState<boolean>(isFavorite)
  const [state, action, isPending] = useActionState(favorAction, undefined)

  return (
    <form action={action}>
      <input type='hidden' name='movieId' value={movieId} />
      <input type='hidden' name='isFavoriteState' value={`${isFavoriteState}`} />
      <button
        type='submit'
        disabled={isPending}
        onClick={() => setIsFavoriteState(!isFavoriteState)}
      >
        <StarIcon className={`h-6 w-6 ${isFavoriteState ? 'text-yellow-500' : 'text-gray-300'}`} />
      </button>
      {state?.errors?.movieId && <p className='text-sm text-red-500'>{state.errors.movieId}</p>}
      {state?.errors?.general && <p className='text-sm text-red-500'>{state.errors.general}</p>}
    </form>
  )
}
