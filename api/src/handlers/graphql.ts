import { Context } from 'hono'
import { buildSchema } from 'graphql'
import { IConversationClient } from '../types'

export const schema = buildSchema(`
type Query {
  describe(thing: String!): DescribeResult
}

type DescribeResult {
  description: String
}
`)

export const rootResolver = (ctx: Context) => {
  return {
    describe: async ({ thing }: { thing: string }) => {
      const conversationClient: IConversationClient =
        ctx.get('conversationClient')
      const prompt = `Can you please tell me about this '${thing}' thing? I don't understand what this is.`
      const description = await conversationClient.converse(thing, prompt)
      return { description }
    },
  }
}
