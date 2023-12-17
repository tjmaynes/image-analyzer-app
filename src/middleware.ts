import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createCacheClient from '@/lib/cacherClient'

const cacheClient = createCacheClient()

const cacheRequestWithKey = async (key: string) => {
  const cacheHit = await cacheClient.get(key)
  if (cacheHit !== null) return Response.json(JSON.parse(cacheHit))

  const response = NextResponse.next()

  const body = await response.json()

  console.log(body)

  cacheClient.put(key, JSON.stringify(body))

  return Response.json(body)
}

export async function middleware(request: NextRequest) {
  if (request.method === 'POST') {
    const key = `${request.nextUrl.pathname}-${JSON.stringify(
      await request.json()
    )}`
    return cacheRequestWithKey(key)
  }
}

export const config = {
  matcher: ['/api/image/description/v1'],
}
