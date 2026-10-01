import { apiRequest } from './client'
import type { AddToLibraryInput, UserBook } from './types'

type BackendUserBook = {
  id: string
  status: string
  book: AddToLibraryInput
}

type BackendAddToLibraryResponse = {
  id: string
  status: string
  book: AddToLibraryInput
}

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
        book: result.book,
      }),
    )
  },

  // Reserved for the future backend listing contract.
  list(): Promise<BackendUserBook[]> {
    return Promise.reject(
      new Error('O endpoint de listagem da biblioteca ainda não existe no backend.'),
    )
  },
}
