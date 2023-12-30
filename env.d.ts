import type { KVNamespace } from '@cloudflare/workers-types'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      IMAGE_ANALYZER_KV: KVNamespace
    }
  }
}

export {}
