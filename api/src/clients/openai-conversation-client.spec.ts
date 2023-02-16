import { None, Option, Some } from 'ts-results'
import { ICacheClient, IOpenAIAPIClient } from '../types'
import { OpenAIConversationClient } from './openai-conversation-client'

describe('OpenAIConversationClient', () => {
  describe('#converse', () => {
    describe('when a previous answer exists', () => {
      it('should return answer from cache', async () => {
        const getMock = jest
          .fn()
          .mockResolvedValue(Some('this is a cached answer'))
        const mockCacheClient = createMockCacheClient(getMock, jest.fn())

        const mockOpenAIAPIWrapper = createMockOpenAIAPIWrapper(jest.fn())

        const sut = new OpenAIConversationClient(
          mockCacheClient(),
          mockOpenAIAPIWrapper()
        )

        const actual = await sut.converse('some-context', 'some-prompt')
        expect(actual).toBe('this is a cached answer')
      })
    })

    describe('when no previous answer exists', () => {
      it('should return answer from openai client', async () => {
        const getMock = jest.fn().mockResolvedValue(None)
        const mockCacheClient = createMockCacheClient(getMock, jest.fn())

        const completionMock = jest.fn().mockResolvedValue({
          json: () => ({ choices: [{ text: 'this is a new answer' }] }),
        })
        const mockOpenAIAPIWrapper = createMockOpenAIAPIWrapper(completionMock)

        const sut = new OpenAIConversationClient(
          mockCacheClient(),
          mockOpenAIAPIWrapper()
        )

        const actual = await sut.converse('some-context', 'some-prompt')
        expect(actual).toBe('this is a new answer')
      })
    })
  })

  const createMockOpenAIAPIWrapper = (
    completionMock: jest.Mock
  ): jest.Mock<IOpenAIAPIClient> => {
    return jest.fn<IOpenAIAPIClient, []>(() => {
      return {
        createCompletion(request: {
          model: string
          max_tokens: number
          prompt: string
        }): Promise<Response> {
          return completionMock()
        },
      }
    })
  }

  const createMockCacheClient = (
    getMock: jest.Mock,
    putMock: jest.Mock
  ): jest.Mock<ICacheClient> => {
    return jest.fn<ICacheClient, []>(() => {
      return {
        get(key: string): Promise<Option<string>> {
          return getMock()
        },
        put(key: string, value: string): Promise<void> {
          return putMock()
        },
      }
    })
  }
})
