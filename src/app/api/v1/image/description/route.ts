import 'server-only'

import { NextRequest, NextResponse } from 'next/server'
import {
  CacheClient,
  InMemoryCacheClient,
  KVCacheClient,
} from '@/lib/cache-client'

export const runtime = 'edge'

const createCacheClient = (): CacheClient => {
  if (process.env.NODE_ENV === 'development') return new InMemoryCacheClient()

  const IMAGE_ANALYZER_KV = process.env.IMAGE_ANALYZER_KV

  return new KVCacheClient(IMAGE_ANALYZER_KV)
}

const cacheClient = createCacheClient()

export async function GET(request: NextRequest) {
  const thing = request.nextUrl.searchParams.get('thing')

  if (!thing)
    return NextResponse.json({
      message: `Please provide 'thing' key as query param...`,
      status: 422,
    })

  const response = await cacheClient.get(thing)

  return response
    ? NextResponse.json({ message: response, status: 200 })
    : NextResponse.json({
        message: `Unable to find a description for ${thing}...`,
        status: 404,
      })
}
