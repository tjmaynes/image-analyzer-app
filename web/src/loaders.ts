import { QueryClient } from '@tanstack/react-query'
import { load as loadModel } from '@tensorflow-models/mobilenet'
import { imageAnalyzerClientQuery } from './queries'
import { IImageAnalyzerClient } from './types'

export const imageAnalyzerClientLoader =
  (queryClient: QueryClient) => async (): Promise<IImageAnalyzerClient> => {
    const model = await loadModel()
    return queryClient.ensureQueryData(imageAnalyzerClientQuery(model))
  }
