'use client'
import { usePathname } from 'next/navigation'
import { publicRoutes } from '@/constants/route'

export function Footer() {
  const pathname = usePathname()
  const isPublicRoute = publicRoutes.includes(pathname)

  if (isPublicRoute) return null

  return (
    <p className='text-center mb-4 mt-4 text-xs'>
      This product uses the TMDB API but is not endorsed or certified by TMDB.
      <br />
      <a href='https://www.themoviedb.org' target='_blank' rel='noopener noreferrer'>
        The Movie Database (TMDB)
      </a>
    </p>
  )
}
