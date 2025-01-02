'use client'
import { Star } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'

type StarRatingProps = {
  totalStars?: number // Total number of stars
  rating?: number // Current rating (decimal allowed)
  className?: string // Optional custom class
}

export function StarRating({ totalStars = 5, rating = 0, className }: StarRatingProps) {
  return (
    <div className={cn('flex rating gap-6', className)}>
      {Array.from({ length: totalStars }, (_, index) => {
        const starIndex = index + 1
        const isHalfStar = rating >= starIndex - 0.5 && rating < starIndex
        const isFullStar = rating >= starIndex

        return (
          <div key={index} className='relative'>
            {/* Full Background Star */}
            <Star
              className={cn(
                'absolute h-6 w-6 transition-colors',
                isFullStar ? 'text-red-500' : 'text-gray-300',
              )}
            />
            {/* Half Star Overlay */}
            {isHalfStar && (
              <Star
                className='absolute h-6 w-6 text-red-500'
                style={{
                  clipPath: 'inset(0 50% 0 0)', // Half-star effect
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
