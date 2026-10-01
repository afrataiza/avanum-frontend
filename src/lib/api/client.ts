import { supabase } from '@/lib/supabase'

const functionsBaseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

export class ApiError extends Error {
  readonly status: number
  readonly code: string | null

  constructor(message: string, status: number, code: string | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT'
  query?: Record<string, string | number | undefined>
  body?: unknown
  authenticated?: boolean
}

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw new ApiError('Não foi possível recuperar a sessão.', 401, 'SESSION_ERROR')
  }

  return data.session?.access_token ?? null
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', query, body, authenticated = true } = options
  const url = new URL(`${functionsBaseUrl}/${endpoint}`)

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })

  const headers = new Headers()

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (authenticated) {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      throw new ApiError('Autenticação necessária.', 401, 'AUTH_REQUIRED')
    }

    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const rawBody = await response.text()
  let parsedBody: unknown = null

  if (rawBody) {
    try {
      parsedBody = JSON.parse(rawBody)
    } catch {
      parsedBody = rawBody
    }
  }

  if (!response.ok) {
    const errorBody =
      typeof parsedBody === 'object' &&
      parsedBody !== null &&
      'error' in parsedBody &&
      typeof parsedBody.error === 'string'
        ? parsedBody.error
        : 'Não foi possível concluir a operação.'

    throw new ApiError(errorBody, response.status)
  }

  return parsedBody as T
}
