import { KVNamespace } from '@cloudflare/workers-types'
import { Some, None, Option } from 'ts-results'
import { ICacheClient } from '../types'

export class CacheClientWrapper implements ICacheClient {
  private readonly keyvalueStore: KVNamespace

  constructor(keyvalueStore: KVNamespace) {
    this.keyvalueStore = keyvalueStore
  }

  get = async (key: string): Promise<Option<string>> => {
    const result = await this.keyvalueStore.get(key)
    return result ? Some(result) : None
  }

  put = async (key: string, value: string): Promise<void> => {
    await this.keyvalueStore.put(key, value)
  }
}
