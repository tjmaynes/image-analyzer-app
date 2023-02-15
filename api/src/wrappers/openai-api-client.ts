import { OpenAIApi } from 'openai-edge'
import { IOpenAIAPIClient } from '../types'

export class OpenAIAPIClientWrapper implements IOpenAIAPIClient {
  private readonly openai: OpenAIApi

  constructor(openai: OpenAIApi) {
    this.openai = openai
  }

  createCompletion = async (request: {
    model: string
    max_tokens: number
    prompt: string
  }): Promise<{ json: <T>() => Promise<T> }> => {
    const result = await this.openai.createCompletion(request)
    return await result.json()
  }
}
