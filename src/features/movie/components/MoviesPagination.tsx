'use client'
import { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type Props = {
  page: number
}

export function MoviesPagination({ page }: Props) {
  const [currentPage, _] = useState(page)

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious href={`/?page=${currentPage - 1}`} />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href={`/?page=${currentPage - 1}`}>{currentPage - 1}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext href={`/?page=${currentPage + 1}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
