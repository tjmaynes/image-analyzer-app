import { KVNamespace } from '@cloudflare/workers-types'

interface CacherClient {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
}

export class KVCacher implements CacherClient {
  private readonly store: KVNamespace

  constructor(store: KVNamespace) {
    this.store = store
  }

  get = async (key: string): Promise<string | null> => {
    const result = await this.store.get(key)
    return result ? result : null
  }

  put = async (key: string, value: string): Promise<void> => {
    await this.store.put(key, value)
  }
}

export class InMemoryCacher implements CacherClient {
  private readonly store: Record<string, string>

  constructor(store: any = {}) {
    this.store = store
  }

  static create() {
    return new InMemoryCacher()
  }

  get = async (key: string): Promise<string | null> => {
    const result = this.store[key]
    return result ? result : null
  }

  put = async (key: string, value: string): Promise<void> => {
    this.store[key] = value
  }
}

const createCacheClient = (): CacherClient => {
  if (process.env.NODE_ENV === 'development') return InMemoryCacher.create()

  const { WEB_PLAYGROUND_CACHE } = process.env as unknown as {
    WEB_PLAYGROUND_CACHE: KVNamespace
  }
  return new KVCacher(WEB_PLAYGROUND_CACHE)
}

export default createCacheClient
