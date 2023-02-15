import { ICacheClient, IConversationClient, IOpenAIAPIClient } from '../types'

export class OpenAIConversationClient implements IConversationClient {
  private readonly cacheClient: ICacheClient
  private readonly openai: IOpenAIAPIClient

  constructor(cacheClient: ICacheClient, openai: IOpenAIAPIClient) {
    this.cacheClient = cacheClient
    this.openai = openai
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
