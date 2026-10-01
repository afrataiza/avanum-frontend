import { apiRequest } from './client'
import type { MapRegion } from './types'

type BackendMapRegion = {
  id: string
  slug: string
  name: string
  description: string | null
  sort_order: number
  created_at: string
  updated_at: string
  nodes: BackendMapNode[]
}

type BackendMapNode = {
  id: string
  region_id: string
  slug: string
  name: string
  description: string | null
  unlock_type: MapRegion['nodes'][number]['unlockType']
  unlock_reference: string | null
  position_x: number
  position_y: number
  sort_order: number
  created_at: string
  updated_at: string
  progress: BackendMapProgress
}

type BackendMapProgress = {
  user_id: string
  node_id: string
  status: MapRegion['nodes'][number]['progress']['status']
  unlocked_at: string | null
  explored_at: string | null
  source: string | null
  source_reference: string | null
  created_at: string | null
  updated_at: string | null
}

const toMapRegion = (region: BackendMapRegion): MapRegion => ({
  id: region.id,
  slug: region.slug,
  name: region.name,
  description: region.description,
  sortOrder: region.sort_order,
  createdAt: region.created_at,
  updatedAt: region.updated_at,
  nodes: region.nodes.map((node) => ({
    id: node.id,
    regionId: node.region_id,
    slug: node.slug,
    name: node.name,
    description: node.description,
    unlockType: node.unlock_type,
    unlockReference: node.unlock_reference,
    positionX: node.position_x,
    positionY: node.position_y,
    sortOrder: node.sort_order,
    createdAt: node.created_at,
    updatedAt: node.updated_at,
    progress: {
      userId: node.progress.user_id,
      nodeId: node.progress.node_id,
      status: node.progress.status,
      unlockedAt: node.progress.unlocked_at,
      exploredAt: node.progress.explored_at,
      source: node.progress.source,
      sourceReference: node.progress.source_reference,
      createdAt: node.progress.created_at,
      updatedAt: node.progress.updated_at,
    },
  })),
})

export const mapApi = {
  getMine() {
    return apiRequest<{ regions: BackendMapRegion[] }>('map').then((result) =>
      result.regions.map(toMapRegion),
    )
  },
}
