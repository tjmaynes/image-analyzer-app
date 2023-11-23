import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createCacheClient from '@/lib/cacherClient'

const middlewareMatcherConfig: Record<string, { cache: string[] }> = {
  '/api/image/description/v1': {
    cache: ['POST'],
  },
}

const cacheClient = createCacheClient()

const cacheRequestWithKey = async (key: string) => {
  const cacheHit = await cacheClient.get(key)
  if (cacheHit !== null) return Response.json(JSON.parse(cacheHit))

  const response = NextResponse.next()

  const body = await response.json()

  cacheClient.put(key, JSON.stringify(body))

  return Response.json(body)
}

export async function middleware(request: NextRequest) {
  if (middlewareMatcherConfig[request.nextUrl.pathname] !== undefined) {
    const pathConfig = middlewareMatcherConfig[request.nextUrl.pathname]

    if (pathConfig.cache.includes('POST') && request.method === 'POST') {
      const key = `${request.nextUrl.pathname}-${JSON.stringify(
        await request.json()
      )}`
      return cacheRequestWithKey(key)
    }
  }
}

export const config = {
  matcher: Object.keys(middlewareMatcherConfig),
}
