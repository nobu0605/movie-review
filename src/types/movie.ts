import { Decimal } from '@prisma/client/runtime/library'

export type Result = {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export type Movie = {
  page: number
  results: Result[]
  total_pages: number
  total_results: number
}

export type MovieReviewFromDB = {
  movieId: number
  averageRating: Decimal
  comments: string[]
}

export type MovieReview = {
  movieId: number
  averageRating: number
  comments: string[]
}

export type MovieDetail = Result & {
  reviews: MovieReview
  isFavorite: boolean
}
