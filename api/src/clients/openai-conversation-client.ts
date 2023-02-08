import { OpenAIApi } from 'openai-edge'
import { ICacheClient, IConversationClient } from '../types'

export class OpenAIConversationClient implements IConversationClient {
  private readonly openai: OpenAIApi
  private readonly cacheClient: ICacheClient

  constructor(openai: OpenAIApi, cacheClient: ICacheClient) {
    this.openai = openai
    this.cacheClient = cacheClient
  }

  converse = async (context: string, prompt: string): Promise<string> => {
    const previousAnswer = await this.cacheClient.get(context)
    if (previousAnswer.some) return previousAnswer.val

    const completion = await this.openai.createCompletion({
      model: 'text-davinci-003',
      max_tokens: 300,
      prompt,
    })
    const { choices } = await completion.json<{ choices: { text: string }[] }>()
    const [result] = choices
    const { text } = result

    this.cacheClient.put(context, text)

    return text
  }
}
