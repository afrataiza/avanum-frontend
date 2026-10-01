import { apiRequest } from './client'
import type {
  ApplyExpeditionProgressInput,
  CreateExpeditionInput,
  Expedition,
  UserExpedition,
} from './types'

type BackendExpedition = {
  id: string
  created_by: string | null
  name: string
  description: string | null
  objective_type: Expedition['objectiveType']
  target_value: number
  starts_at: string | null
  ends_at: string | null
  active: boolean
  created_at: string
  updated_at: string
}

type BackendUserExpedition = {
  id: string
  user_id: string
  expedition_id: string
  current_value: number
  status: UserExpedition['status']
  started_at: string
  completed_at: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
  expedition: BackendExpedition
}

const toExpedition = (item: BackendExpedition): Expedition => ({
  id: item.id,
  createdBy: item.created_by,
  name: item.name,
  description: item.description,
  objectiveType: item.objective_type,
  targetValue: item.target_value,
  startsAt: item.starts_at,
  endsAt: item.ends_at,
  active: item.active,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
})

const toUserExpedition = (item: BackendUserExpedition): UserExpedition => ({
  id: item.id,
  userId: item.user_id,
  expeditionId: item.expedition_id,
  currentValue: item.current_value,
  status: item.status,
  startedAt: item.started_at,
  completedAt: item.completed_at,
  cancelledAt: item.cancelled_at,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
  expedition: toExpedition(item.expedition),
})

export const expeditionsApi = {
  listMine() {
    return apiRequest<{ expeditions: BackendUserExpedition[] }>('expeditions').then(
      (result) => result.expeditions.map(toUserExpedition),
    )
  },

  create(input: CreateExpeditionInput) {
    return apiRequest<{ expedition: BackendExpedition }>('create-expedition', {
      method: 'POST',
      body: input,
    }).then((result) => toExpedition(result.expedition))
  },

  updateProgress(input: ApplyExpeditionProgressInput) {
    return apiRequest('update-expedition-progress', {
      method: 'PUT',
      body: input,
    })
  },

  cancel(userExpeditionId: string) {
    return apiRequest<{ expedition: BackendExpedition }>('cancel-expedition', {
      method: 'PUT',
      body: { userExpeditionId },
    }).then((result) => toExpedition(result.expedition))
  },
}
