import 'server-only'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface IOpenAIWrapper {
  chat(prompt: string): Promise<{ response: string }>
}

export default class OpenAIWrapper implements IOpenAIWrapper {
  async chat(prompt: string): Promise<{ response: string }> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      })

      const openaiResponse = response.choices.join(', ')

      return Promise.resolve({ response: openaiResponse })
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
