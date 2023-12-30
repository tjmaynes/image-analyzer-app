import 'server-only'

import { KVNamespace } from '@cloudflare/workers-types'

export interface CacheClient {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
}

export class KVCacheClient implements CacheClient {
  private readonly store: KVNamespace

  constructor(store: KVNamespace) {
    this.store = store
  }

  get(key: string): Promise<string | null> {
    return this.store.get(key)
  }

  put(key: string, value: string): Promise<void> {
    return this.store.put(key, value)
  }
}

export class InMemoryCacheClient implements CacheClient {
  private readonly store: Record<string, string>

  constructor(store: any = {}) {
    this.store = store
  }

  get(key: string): Promise<string | null> {
    return Promise.resolve(this.store[key] ?? null)
  }

  put(key: string, value: string): Promise<void> {
    this.store[key] = value
    return Promise.resolve()
  }
}
