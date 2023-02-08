import { Hono } from 'hono'
import { appBuilder } from './builders'
import { IConversationClient } from './types'

const env = getMiniflareBindings()

describe('API', () => {
  let app: Hono

  beforeEach(() => {
    app = appBuilder(() => ({
      conversationClient: new FakeConversationClient(),
    }))
  })

  it('POST /conversation', async () => {
    const payload = JSON.stringify({
      context: 'Hello there',
    })
    const req = new Request('http://localhost/conversation', {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await app.fetch(req, {
      ORIGINS: 'http://localhost',
      OPENAI_API_KEY: 'some-key',
      IMAGE_ANALYZER_DB: env.IMAGE_ANALYZER_DB,
    })
    expect(res.status).toBe(200)

    const { description } = await res.json<{ description: string }>()
    expect(description).toBe('I believe that this is a real conversation...')
  })
})

class FakeConversationClient implements IConversationClient {
  converse = async (context: string, prompt: string): Promise<string> => {
    return 'I believe that this is a real conversation...'
  }
}
