import { Hono } from 'hono'
import { appBuilder } from './builders'
import { IConversationClient } from './types'

const env = getMiniflareBindings()
const bindings = {
  ORIGINS: 'http://localhost,',
  OPENAI_API_KEY: 'some-key',
  IMAGE_ANALYZER_DB: env.IMAGE_ANALYZER_DB,
}

describe('API', () => {
  let app: Hono

  beforeEach(() => {
    app = appBuilder(() => ({
      conversationClient: new FakeConversationClient(),
    }))
  })

  describe('POST /graphql', () => {
    describe('when querying to describe an object', () => {
      it('should return a OK (200) response', async () => {
        const thing = 'something'
        const body = JSON.stringify({
          query: `{ describe(thing: "${thing}"){ background } }`,
        })
        const req = new Request('http://localhost/graphql', {
          method: 'POST',
          body: body,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const res = await app.fetch(req, bindings)

        expect(res.status).toBe(200)

        expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
          'http://localhost'
        )

        const { data } = await res.json<{
          data: { describe: { background: string } }
        }>()
        expect(data.describe.background).toBe(
          'I believe that this is a real conversation...'
        )
      })
    })
  })
})

class FakeConversationClient implements IConversationClient {
  converse = async (context: string, prompt: string): Promise<string> => {
    return 'I believe that this is a real conversation...'
  }
}
