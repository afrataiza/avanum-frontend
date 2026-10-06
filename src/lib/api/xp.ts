import { apiRequest } from './client'
import type { XPBalance, XPTransaction } from './types'

type BackendXPBalance = {
  user_id: string
  total_xp: number
  level: number
  level_name: string
  level_xp: number
  level_xp_required: number
  level_progress: number
  created_at?: string
  updated_at?: string
}

type BackendXPTransaction = {
  id: string
  user_id: string
  amount: number
  source: string
  source_reference: string | null
  idempotency_key: string
  created_at: string
}

export const xpApi = {
  getMine() {
    return apiRequest<{
      balance: BackendXPBalance
      transactions: BackendXPTransaction[]
    }>('user-xp').then((result): { balance: XPBalance; transactions: XPTransaction[] } => ({
      balance: {
        userId: result.balance.user_id,
        totalXp: result.balance.total_xp,
        level: result.balance.level,
        levelName: result.balance.level_name,
        levelXp: result.balance.level_xp,
        levelXpRequired: result.balance.level_xp_required,
        levelProgress: result.balance.level_progress,
        createdAt: result.balance.created_at ?? null,
        updatedAt: result.balance.updated_at ?? null,
      },
      transactions: result.transactions.map((item) => ({
        id: item.id,
        userId: item.user_id,
        amount: item.amount,
        source: item.source,
        sourceReference: item.source_reference,
        idempotencyKey: item.idempotency_key,
        createdAt: item.created_at,
      })),
    }))
  },
}
