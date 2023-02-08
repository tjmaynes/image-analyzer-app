import { Hono, Context, Next } from 'hono'
import { cors } from 'hono/cors'
import { Configuration, OpenAIApi } from 'openai-edge'
import { Bindings } from './bindings'
import { CacheClient, OpenAIConversationClient } from './clients'
import { handleConversationBuilder } from './handlers'
import {
  AppDependencies,
  AppDependenciesBuilder,
  ConversationRequestBody,
} from './types'

export const appDependenciesBuilder = (
  keyvalueStore: KVNamespace,
  openAIApiKey: string
): AppDependencies => {
  const cacheClient = new CacheClient(keyvalueStore)
  const configuration = new Configuration({ apiKey: openAIApiKey })
  const openai = new OpenAIApi(configuration)
  const conversationClient = new OpenAIConversationClient(openai, cacheClient)
  return { conversationClient }
}

export const appBuilder = (
  dependenciesBuilder: AppDependenciesBuilder
): Hono => {
  const app = new Hono<{ Bindings: Bindings }>()

  app.use('*', middlewareBuilder(dependenciesBuilder))

  app.post('/conversation', async (c) => {
    const { context } = await c.req.json<ConversationRequestBody>()
    const handleConversation = handleConversationBuilder(
      c.get('conversationClient')
    )

    const result = await handleConversation(context)
    return c.json({ description: result })
  })

  return app
}

export const middlewareBuilder =
  (dependenciesBuilder: AppDependenciesBuilder) =>
  async (c: Context, next: Next): Promise<void> => {
    const { conversationClient } = dependenciesBuilder(
      c.env.IMAGE_ANALYZER_DB,
      c.env.OPENAI_API_KEY
    )

    c.set('conversationClient', conversationClient)

    cors({
      origin: c.env.ORIGINS.split(',').filter(
        (origin: string) => origin.length > 0
      ),
      allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
      maxAge: 600,
      credentials: true,
    })

    return await next()
  }
