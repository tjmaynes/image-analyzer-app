import 'server-only'

import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const { thing } = await request.json()

  const prompt = `Can you tell me about this '${thing}' thing? I don't understand what this is.`

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  })

  const openaiResponse = response.choices.join(', ')

  return Response.json({ description: openaiResponse })
}
