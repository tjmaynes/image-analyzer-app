import { QueryClient } from '@tanstack/react-query'
import { imageAnalyzerClientQuery } from './queries'
import { IImageAnalyzerClient } from './types'

export const imageAnalyzerClientLoader =
  (queryClient: QueryClient) => async (): Promise<IImageAnalyzerClient> =>
    queryClient.ensureQueryData(imageAnalyzerClientQuery())
