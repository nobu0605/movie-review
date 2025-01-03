'use client'
import { useRouter } from 'next/navigation'
import { useActionState, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createReview } from '@/features/review/serverActions/review'

type Props = {
  movieId: number
}

export function ReviewDialog({ movieId }: Props) {
  const [state, action, isPending] = useActionState(createReview, undefined)
  const isSuccess = (state?.message && !state?.errors) || false
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setOpen(false)
        router.refresh()
      }, 500)
    }
  }, [isSuccess])

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button variant='gray' size='sm' onClick={() => setOpen(true)}>
          Write a review
        </Button>
      </DialogTrigger>
      <DialogOverlay onClick={() => setOpen(false)} />
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
        </DialogHeader>
        <form action={action}>
          <input type='hidden' name='movieId' value={movieId} />
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='rating' className='text-right'>
                Rating
              </Label>
              <Input
                id='rating'
                name='rating'
                className='col-span-3'
                type='number'
                min={0}
                max={5}
              />
            </div>
            {state?.errors?.rating && <p className='text-sm text-red-500'>{state.errors.rating}</p>}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='comment' className='text-right'>
                Comment
              </Label>
              <Textarea id='comment' name='comment' className='col-span-3 h-40' />
            </div>
            {state?.errors?.comment && (
              <p className='text-sm text-red-500'>{state.errors.comment}</p>
            )}
          </div>
          <DialogFooter>
            <Button disabled={isPending} type='submit'>
              Submit
            </Button>
          </DialogFooter>
          {state?.message && <p className='text-sm text-green-500'>{state.message}</p>}
          {state?.errors?.general && <p className='text-sm text-red-500'>{state.errors.general}</p>}
        </form>
      </DialogContent>
    </Dialog>
  )
}
