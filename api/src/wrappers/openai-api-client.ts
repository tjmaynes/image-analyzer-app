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
  }): Promise<Response> => await this.openai.createCompletion(request)
}
