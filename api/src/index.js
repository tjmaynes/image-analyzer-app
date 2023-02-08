import { Router } from 'itty-router'
import { error, json } from 'itty-router-extras'
import { createCors } from 'itty-cors'
import { Configuration, OpenAIApi } from 'openai-edge'

const apiKey = OPENAI_API_KEY
const configuration = new Configuration({ apiKey })
const openai = new OpenAIApi(configuration)

const getDescriptionForPrompt = async (context, prompt) => {
  const previousAnswer = await IMAGE_ANALYZER_DB.get(context)
  if (previousAnswer) return previousAnswer

  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    max_tokens: 300,
    prompt,
  })
  const { choices } = await completion.json()
  const [result] = choices
  const { text } = result

  IMAGE_ANALYZER_DB.put(context, text)

  return text
}

const origins = IMAGE_ANALYZER_API_ORIGINS.split(', ')

const { preflight, corsify } = createCors({
  methods: ['POST'],
  origins: origins,
  maxAge: 3600,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
})

console.log(origins)

const router = Router()

router.all('*', preflight).post('/conversation', async (request) => {
  try {
    const { context } = await request.json()
    const prompt = `Can you please tell me about this '${context}' thing? I don't understand what this is.`
    const description = await getDescriptionForPrompt(context, prompt)

    return corsify(json({ description: description }))
  } catch (e) {
    return corsify(error(e))
  }
})

addEventListener('fetch', (event) =>
  event.respondWith(router.handle(event.request))
)
