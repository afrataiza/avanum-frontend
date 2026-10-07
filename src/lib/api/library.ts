import { apiRequest } from './client'
import type { AddToLibraryInput, Book, Reading, UserBook } from './types'

type BackendBook = {
  id: string
  external_id: string
  title: string
  authors: string[]
  synopsis: string | null
  cover_url: string | null
  publication_year: number | null
  categories: string[]
  language: string | null
  isbn10: string | null
  isbn13: string | null
}

type BackendAddToLibraryResponse = {
  id: string
  status: string
  book: BackendBook
}

const toBook = (book: BackendBook): Book => ({
  id: book.id,
  title: book.title,
  authors: book.authors,
  synopsis: book.synopsis,
  coverUrl: book.cover_url,
  publicationYear: book.publication_year,
  categories: book.categories,
  language: book.language,
  isbn10: book.isbn10,
  isbn13: book.isbn13,
})

type BackendReading = {
  id: string
  user_book_id: string
  format: Reading['format']
  total_units: number
  current_units: number
  status: Reading['status']
  started_at: string
  paused_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

type BackendUserBook = {
  id: string
  status: string
  created_at: string | null
  updated_at: string | null
  book: BackendBook
  reading: BackendReading | null
}

const toReading = (reading: BackendReading): Reading => ({
  id: reading.id,
  userBookId: reading.user_book_id,
  format: reading.format,
  totalUnits: reading.total_units,
  currentUnits: reading.current_units,
  status: reading.status,
  startedAt: reading.started_at,
  pausedAt: reading.paused_at,
  completedAt: reading.completed_at,
  createdAt: reading.created_at,
  updatedAt: reading.updated_at,
})

export const libraryApi = {
  list() {
    return apiRequest<{ items: BackendUserBook[] }>('user-library').then((result) =>
      result.items.map((item): UserBook => ({
        id: item.id,
        status: item.status,
        bookId: item.book.id,
        book: { ...toBook(item.book), id: item.book.external_id },
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        reading: item.reading ? toReading(item.reading) : null,
      })),
    )
  },

  add(book: AddToLibraryInput) {
    return apiRequest<BackendAddToLibraryResponse>('add-to-library', {
      method: 'POST',
      body: { book },
    }).then((result): UserBook => ({
      id: result.id,
      status: result.status,
      bookId: result.book.id,
      book: { ...toBook(result.book), id: result.book.external_id },
      createdAt: null,
      updatedAt: null,
      reading: null,
    }))
  },
}
