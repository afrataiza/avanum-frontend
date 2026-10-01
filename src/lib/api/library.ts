import { apiRequest } from './client'
import type { AddToLibraryInput, Book, UserBook } from './types'

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

export const libraryApi = {
  add(book: AddToLibraryInput) {
    return apiRequest<BackendAddToLibraryResponse>('add-to-library', {
      method: 'POST',
      body: { book },
    }).then(
      (result): UserBook => ({
        id: result.id,
        status: result.status,
        bookId: result.book.id,
        book: toBook(result.book),
      }),
    )
  },
}
