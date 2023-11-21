import { Option } from 'ts-results'

export interface IOpenAIAPIClient {
  createCompletion(request: {
    model: string
    max_tokens: number
    prompt: string
  }): Promise<Response>
}

export interface ICacheClient {
  get(key: string): Promise<Option<string>>
  put(key: string, value: string): Promise<void>
}

export interface IConversationClient {
  converse(context: string, prompt: string): Promise<string>
}

export type ConversationRequestBody = {
  context: string
}

export type AppDependencies = { conversationClient: IConversationClient }

export type AppDependenciesBuilder = (
  keyvalueStore: KVNamespace,
  openAIApiKey: string
) => AppDependencies
