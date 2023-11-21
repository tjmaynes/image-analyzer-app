import { QueryClient } from '@tanstack/react-query'
import { load as loadModel } from '@tensorflow-models/mobilenet'
import {
  ApiClient,
  ImageAnalyzerClient,
  MobileNetImageClassifierClient,
} from './clients'
import {
  ImageClassificationData,
  ImageMetadata,
  AppDependencies,
} from './types'

export const queryClient = new QueryClient()

export const appDependenciesQuery = () => ({
  queryKey: ['app-dependencies'],
  queryFn: async (): Promise<AppDependencies> => {
    const model = await loadModel()
    const analyzerClient = new ImageAnalyzerClient(
      new MobileNetImageClassifierClient(model),
      new ApiClient(process.env.API_HOST)
    )
    return { analyzerClient }
  },
})

export const loadImageQuery = (source: string) => ({
  queryKey: ['load-image', source],
  queryFn: async () =>
    await fetch(source)
      .then((response) => response.blob())
      .then((blob) => ({
        id: source,
        imageBlob: blob,
      })),
})

export const analyzeImageQuery = (imageMetadata: ImageMetadata) => ({
  queryKey: ['analyze-image', imageMetadata.id],
  queryFn: async (): Promise<ImageClassificationData> => {
    const { analyzerClient } = queryClient.getQueryData([
      'app-dependencies',
    ]) as AppDependencies

    const result = await analyzerClient.analyze(imageMetadata)
    if (result.ok) return result.val
    else throw result.val
  },
})
