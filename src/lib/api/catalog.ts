import { apiRequest } from './client'
import type { Book, BookSearchResult } from './types'

type BackendBook = {
  id: string
  title: string
  authors: string[]
  synopsis: string | null
  coverUrl: string | null
  publicationYear: number | null
  categories: string[]
  language: string | null
  isbn10: string | null
  isbn13: string | null
}

const toBook = (book: BackendBook): Book => book

export const catalogApi = {
  search(query: string) {
    return apiRequest<BookSearchResult>('books-search', {
      authenticated: false,
      query: { q: query },
    })
  },

  getById(id: string) {
    return apiRequest<BackendBook>('book-details', {
      authenticated: false,
      query: { id },
    }).then(toBook)
  },
}
