import { QueryClient } from '@tanstack/react-query'
import { load as loadModel } from '@tensorflow-models/mobilenet'
import {
  ApiClient,
  ImageAnalyzerClient,
  MobileNetImageClassifierClient,
} from './clients'
import {
  IImageAnalyzerClient,
  ImageClassificationData,
  ImageMetadata,
} from './types'

export const queryClient = new QueryClient()

export const imageAnalyzerClientQuery = () => ({
  queryKey: ['image-analyzer-client'],
  queryFn: async (): Promise<IImageAnalyzerClient> => {
    const model = await loadModel()
    return new ImageAnalyzerClient(
      new MobileNetImageClassifierClient(model),
      new ApiClient(import.meta.env.VITE_API_HOST || 'http://localhost:8081')
    )
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
    const client = queryClient.getQueryData([
      'image-analyzer-client',
    ]) as IImageAnalyzerClient

    const result = await client.analyze(imageMetadata)
    if (result.ok) return result.val
    else throw result.val
  },
})
