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
  const configuration = new Configuration({ apiKey: openAIApiKey })
  const openai = new OpenAIApi(configuration)
  const cacheClient = new CacheClient(keyvalueStore)
  return {
    conversationClient: new OpenAIConversationClient(openai, cacheClient),
  }
}

export const appBuilder = (
  dependenciesBuilder: AppDependenciesBuilder
): Hono => {
  const app = new Hono<{ Bindings: Bindings }>()

  app.use('*', middlewareBuilder(dependenciesBuilder))

  app.options('*', (c) => c.text('', 204))

  app.post('/conversation', async (c) => {
    const body = await c.req.json<ConversationRequestBody>()
    if (!body['context'])
      return new Response('Unprocessable Entity', { status: 422 })

    const handleConversation = handleConversationBuilder(
      c.get('conversationClient')
    )

    const result = await handleConversation(body.context)
    return c.json({ description: result }, 201)
  })

  return app
}

export const middlewareBuilder =
  (dependenciesBuilder: AppDependenciesBuilder) =>
  async (cxt: Context, next: Next): Promise<void | Response> => {
    const { conversationClient } = dependenciesBuilder(
      cxt.env.IMAGE_ANALYZER_DB,
      cxt.env.OPENAI_API_KEY
    )

    cxt.set('conversationClient', conversationClient)

    const origin = cxt.env.ORIGINS.split(',').filter(
      (origin: string) => origin.length > 0
    )

    const handler = cors({
      origin: origin,
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
    })

    return handler(cxt, next)
  }
