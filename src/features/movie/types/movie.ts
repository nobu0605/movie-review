import { Decimal } from '@prisma/client/runtime/library'

export type MovieResult = {
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
  results: MovieResult[]
  total_pages: number
  total_results: number
}

export type MovieReviewFromDB = {
  movieId: number
  averageRating: Decimal
  comments: string[]
}

export type Review = {
  id: number
  movieId: number
  user?: {
    name: string
  }
  userId: number
  rating?: number
  comment: string | null
}

export type MovieDetail = MovieResult & {
  isFavorite: boolean
  averageRating?: number
  reviews: Review[]
}
