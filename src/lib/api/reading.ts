import { apiRequest } from './client'
import type {
  Reading,
  StartReadingInput,
  UpdateReadingProgressInput,
  UpdateReadingStatusInput,
} from './types'

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

export const readingApi = {
  start(input: StartReadingInput) {
    return apiRequest<{ reading: BackendReading }>('start-reading', {
      method: 'POST',
      body: input,
    }).then((result) => toReading(result.reading))
  },

  updateProgress(input: UpdateReadingProgressInput) {
    return apiRequest<{ reading: BackendReading }>('update-reading-progress', {
      method: 'PUT',
      body: input,
    }).then((result) => toReading(result.reading))
  },

  updateStatus(input: UpdateReadingStatusInput) {
    return apiRequest<{ reading: BackendReading }>('update-reading-status', {
      method: 'PUT',
      body: input,
    }).then((result) => {
      if ('reading' in result && result.reading) {
        return toReading(result.reading)
      }

      return result
    })
  },

  getById(readingId: string) {
    return apiRequest<{ reading: BackendReading }>('reading-details', {
      query: { readingId },
    }).then((result) => toReading(result.reading))
  },
}
