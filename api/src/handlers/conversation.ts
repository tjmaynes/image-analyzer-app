import { IConversationClient } from '../types'

export const handleConversationBuilder =
  (conversationClient: IConversationClient) =>
  async (context: string): Promise<string> => {
    const prompt = `Can you please tell me about this '${context}' thing? I don't understand what this is.`
    return await conversationClient.converse(context, prompt)
  }
