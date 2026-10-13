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

type SessionCacheEntry<T> = {
  cachedAt: number
  value: T
}

const SEARCH_CACHE_TTL_MS = 60 * 60 * 1000
const DETAILS_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
const CACHE_PREFIX = 'avanum:catalog:'

const toBook = (book: BackendBook): Book => book

function normalizeQuery(query: string) {
  return query.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR')
}

function readSessionCache<T>(key: string, ttlMs: number): T | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = window.sessionStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null

    const entry = JSON.parse(raw) as SessionCacheEntry<T>
    if (!Number.isFinite(entry.cachedAt) || Date.now() - entry.cachedAt >= ttlMs) {
      window.sessionStorage.removeItem(CACHE_PREFIX + key)
      return null
    }

    return entry.value
  } catch {
    return null
  }
}

function writeSessionCache<T>(key: string, value: T) {
  try {
    if (typeof window === 'undefined') return
    const entry: SessionCacheEntry<T> = { cachedAt: Date.now(), value }
    window.sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // Cache is an optimization; storage/quota failures must not break catalog navigation.
  }
}

export const catalogApi = {
  async search(query: string): Promise<BookSearchResult> {
    const normalizedQuery = normalizeQuery(query)
    if (!normalizedQuery) {
      return apiRequest<BookSearchResult>('books-search', {
        authenticated: false,
        query: { q: query },
      })
    }

    const cacheKey = `search:${normalizedQuery}`
    const cached = readSessionCache<BookSearchResult>(cacheKey, SEARCH_CACHE_TTL_MS)
    if (cached) return cached

    const result = await apiRequest<BookSearchResult>('books-search', {
      authenticated: false,
      query: { q: query },
    })
    writeSessionCache(cacheKey, result)
    return result
  },

  async getById(id: string): Promise<Book> {
    const cacheKey = `details:${id}`
    const cached = readSessionCache<Book>(cacheKey, DETAILS_CACHE_TTL_MS)
    if (cached) return cached

    const book = await apiRequest<BackendBook>('book-details', {
      authenticated: false,
      query: { id },
    }).then(toBook)
    writeSessionCache(cacheKey, book)
    return book
  },
}
