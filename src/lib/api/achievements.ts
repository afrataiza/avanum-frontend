import { apiRequest } from './client'
import type { Achievement, UserAchievement } from './types'

type BackendAchievement = Omit<Achievement, 'createdAt' | 'updatedAt'> & {
  created_at: string
  updated_at: string
}

type BackendUserAchievement = {
  id: string
  user_id: string
  achievement_id: string
  source_reference: string | null
  achieved_at: string
  achievement: BackendAchievement
}

const toAchievement = (achievement: BackendAchievement): Achievement => ({
  id: achievement.id,
  code: achievement.code,
  name: achievement.name,
  description: achievement.description,
  trigger: achievement.trigger,
  threshold: achievement.threshold,
  metadata: achievement.metadata,
  active: achievement.active,
  createdAt: achievement.created_at,
  updatedAt: achievement.updated_at,
})

const toUserAchievement = (item: BackendUserAchievement): UserAchievement => ({
  id: item.id,
  userId: item.user_id,
  achievementId: item.achievement_id,
  sourceReference: item.source_reference,
  achievedAt: item.achieved_at,
  achievement: toAchievement(item.achievement),
})

export const achievementsApi = {
  list() {
    return apiRequest<{ achievements: BackendAchievement[] }>('achievements').then((result) =>
      result.achievements.map(toAchievement),
    )
  },

  listMine() {
    return apiRequest<{ achievements: BackendUserAchievement[] }>('user-achievements').then(
      (result) => result.achievements.map(toUserAchievement),
    )
  },
}
