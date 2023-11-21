import { KVNamespace } from '@cloudflare/workers-types'

export interface Bindings {
  ORIGINS: string
  OPENAI_API_KEY: string
  IMAGE_ANALYZER_DB: KVNamespace
}

declare global {
  function getMiniflareBindings(): Bindings
}
