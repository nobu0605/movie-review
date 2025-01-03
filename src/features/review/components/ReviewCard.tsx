'use client'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Review as ReviewType } from '@/features/movie/types/movie'
import { StarRating } from '@/features/review/components/StarRating'
import { deleteReview } from '@/features/review/serverActions/review'
import { User } from '@/features/user/types/user'

type Props = {
  review: ReviewType
  className?: string
  user: User
}

export function ReviewCard({ review, className, user }: Props) {
  const isUserReview = review.userId === user.id
  const [state, action, isPending] = useActionState(deleteReview, undefined)
  const isSuccess = (state?.message && !state?.errors) || false
  const router = useRouter()

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.refresh()
      }, 500)
    }
  }, [isSuccess])

  return (
    <div className={className} id='reviews'>
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <CardTitle>{review.user?.name}</CardTitle>
            {isUserReview && (
              <Popover>
                <PopoverTrigger>&#65049;</PopoverTrigger>
                <PopoverContent>
                  <form
                    action={(data) => {
                      const result = confirm('Are you sure you want to delete this review?')
                      if (result) {
                        action(data)
                      }
                    }}
                  >
                    <input type='hidden' name='reviewId' value={review.id} />
                    <button className='w-full' type='submit' disabled={isPending}>
                      Delete a review
                    </button>
                    {state?.errors?.general && (
                      <p className='text-sm text-red-500'>{state.errors.general}</p>
                    )}
                    {state?.errors?.reviewId && (
                      <p className='text-sm text-red-500'>{state.errors.reviewId}</p>
                    )}
                  </form>
                </PopoverContent>
              </Popover>
            )}
          </div>
          <div className='flex direction-row gap-2'>
            <span>Rating {review.rating}</span>
            <StarRating className='mr-6' rating={review.rating} />
          </div>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <CardDescription>{review.comment}</CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
