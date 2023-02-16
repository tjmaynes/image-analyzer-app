import { QueryClient } from '@tanstack/react-query'
import { MobileNet } from '@tensorflow-models/mobilenet'
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

export const imageAnalyzerClientQuery = (model: MobileNet) => ({
  queryKey: ['image-analyzer-client'],
  queryFn: async (): Promise<IImageAnalyzerClient> => {
    return new ImageAnalyzerClient(
      new MobileNetImageClassifierClient(model),
      new ApiClient(process.env.API_HOST || '')
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
