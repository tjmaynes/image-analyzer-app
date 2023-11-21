import { Hono, Context, Next } from 'hono'
import { cors } from 'hono/cors'
import { graphqlServer } from '@hono/graphql-server'
import { Configuration, OpenAIApi } from 'openai-edge'
import { Bindings } from './bindings'
import { OpenAIConversationClient } from './clients'
import { rootResolver, schema } from './handlers'
import { AppDependencies, AppDependenciesBuilder } from './types'
import { OpenAIAPIClientWrapper, CacheClientWrapper } from './wrappers'

export const appDependenciesBuilder = (
  keyvalueStore: KVNamespace,
  openAIApiKey: string
): AppDependencies => {
  const openai = new OpenAIApi(new Configuration({ apiKey: openAIApiKey }))

  return {
    conversationClient: new OpenAIConversationClient(
      new CacheClientWrapper(keyvalueStore),
      new OpenAIAPIClientWrapper(openai)
    ),
  }
}

export const appBuilder = (
  dependenciesBuilder: AppDependenciesBuilder
): Hono => {
  const app = new Hono<{ Bindings: Bindings }>()

  app.use('*', middlewareBuilder(dependenciesBuilder))

  app.options('*', (c) => c.text('', 204))

  app.use(
    '/graphql',
    graphqlServer({
      schema,
      rootResolver,
    })
  )

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
