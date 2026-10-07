export type ReadingFormat = 'physical' | 'ebook' | 'audiobook'
export type ReadingStatus = 'reading' | 'paused' | 'abandoned' | 'completed'
export type ExpeditionObjectiveType = 'books_completed' | 'pages_read' | 'minutes_listened'
export type ExpeditionStatus = 'active' | 'completed' | 'cancelled'
export type MapNodeStatus = 'locked' | 'discovered' | 'explored'

export type Book = {
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

export type BookSearchResult = {
  items: Book[]
  total: number
}

export type UserBook = {
  id: string
  status: string
  bookId: string
  book: Book
  createdAt: string | null
  updatedAt: string | null
  reading: Reading | null
}

export type XPBalance = {
  userId: string
  totalXp: number
  createdAt: string | null
  updatedAt: string | null
  level: number
  levelName: string
  levelXp: number
  levelXpRequired: number
  levelProgress: number
}

export type XPTransaction = {
  id: string
  userId: string
  amount: number
  source: string
  sourceReference: string | null
  idempotencyKey: string
  createdAt: string
}

export type Reading = {
  id: string
  userBookId: string
  format: ReadingFormat
  totalUnits: number
  currentUnits: number
  status: ReadingStatus
  startedAt: string
  pausedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export type Achievement = {
  id: string
  code: string
  name: string
  description: string
  trigger: string
  threshold: number
  metadata: Record<string, unknown>
  active: boolean
  createdAt: string
  updatedAt: string
}

export type UserAchievement = {
  id: string
  userId: string
  achievementId: string
  sourceReference: string | null
  achievedAt: string
  achievement: Achievement
}

export type Expedition = {
  id: string
  createdBy: string | null
  name: string
  description: string | null
  objectiveType: ExpeditionObjectiveType
  targetValue: number
  startsAt: string | null
  endsAt: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type UserExpedition = {
  id: string
  userId: string
  expeditionId: string
  currentValue: number
  status: ExpeditionStatus
  startedAt: string
  completedAt: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
  expedition: Expedition
}

export type MapNode = {
  id: string
  regionId: string
  slug: string
  name: string
  description: string | null
  unlockType:
    | 'manual'
    | 'reading_started'
    | 'reading_completed'
    | 'achievement_granted'
    | 'expedition_completed'
  unlockReference: string | null
  positionX: number
  positionY: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type UserMapProgress = {
  userId: string
  nodeId: string
  status: MapNodeStatus
  unlockedAt: string | null
  exploredAt: string | null
  source: string | null
  sourceReference: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type MapNodeWithProgress = MapNode & {
  progress: UserMapProgress
}

export type MapRegion = {
  id: string
  slug: string
  name: string
  description: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  nodes: MapNodeWithProgress[]
}

export type CreateExpeditionInput = {
  name: string
  description?: string | null
  objectiveType: ExpeditionObjectiveType
  targetValue: number
  startsAt?: string | null
  endsAt?: string | null
}

export type ApplyExpeditionProgressInput = {
  userExpeditionId: string
  amount: number
  source: string
  sourceReference?: string | null
  idempotencyKey: string
}

export type AddToLibraryInput = Omit<Book, 'id'> & {
  externalId: string
}

export type StartReadingInput = {
  userBookId: string
  format: ReadingFormat
  totalUnits: number
}

export type UpdateReadingProgressInput = {
  readingId: string
  currentUnits: number
}

export type UpdateReadingStatusInput = {
  readingId: string
  status: Exclude<ReadingStatus, 'completed'>
}

export type CancelExpeditionInput = {
  userExpeditionId: string
}
