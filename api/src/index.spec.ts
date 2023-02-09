import { Hono } from 'hono'
import { Bindings } from 'hono/dist/types/types'
import { appBuilder } from './builders'
import { IConversationClient } from './types'

const env = getMiniflareBindings()

describe('API', () => {
  let app: Hono
  let bindings: Bindings

  beforeEach(() => {
    app = appBuilder(() => ({
      conversationClient: new FakeConversationClient(),
    }))
    bindings = {
      ORIGINS: 'http://localhost,',
      OPENAI_API_KEY: 'some-key',
      IMAGE_ANALYZER_DB: env.IMAGE_ANALYZER_DB,
    }
  })

  describe('POST /conversation', () => {
    describe('when given a valid request', () => {
      it('should return a Created (201) response', async () => {
        const req = new Request('http://localhost/conversation', {
          method: 'POST',
          body: JSON.stringify({
            context: 'Hello there',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const res = await app.fetch(req, bindings)

        expect(res.status).toBe(201)

        console.log(res.headers)

        expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
          'http://localhost'
        )

        const { description } = await res.json<{ description: string }>()
        expect(description).toBe(
          'I believe that this is a real conversation...'
        )
      })
    })

    describe('when given an invalid request', () => {
      it('should return Unprocessable Entity (422) response', async () => {
        const req = new Request('http://localhost/conversation', {
          method: 'POST',
          body: JSON.stringify({
            hello: 'Hello there',
          }),
          headers: {
            'Content-Type': 'application/json',
            Origin: 'http://subdomain.example.com',
          },
        })

        const res = await app.fetch(req, bindings)
        expect(res.status).toBe(422)
      })
    })
  })
})

class FakeConversationClient implements IConversationClient {
  converse = async (context: string, prompt: string): Promise<string> => {
    return 'I believe that this is a real conversation...'
  }
}
