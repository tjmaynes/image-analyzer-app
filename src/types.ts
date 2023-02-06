import { MobileNet } from '@tensorflow-models/mobilenet'
import { Option, Result } from 'ts-results'

export type ImageProcessingResults = { data: ImageMetadata[]; errors: Error[] }

export type ImageMetadata = {
  name: string
  imageData: ImageData
  imageURL: string
}

export type ClassificationData = {
  name: string
  predictions: { className: string; probability: number }[]
}

export type ImageClassificationData = ImageMetadata &
  ClassificationData & {
    description: string
  }

export type ImageClassifier = (
  imageFile: Blob,
  model: MobileNet
) => Promise<Result<ImageClassificationData, Error>>

export interface IImageClassifierClient {
  classify(
    imageMetadata: ImageMetadata
  ): Promise<Result<ClassificationData, Error>>
}

export interface IApiClient {
  infer(context: string): Promise<Option<{ description: string }>>
}

export interface IImageAnalyzerClient {
  analyze(image: ImageMetadata): Promise<Result<ImageClassificationData, Error>>
}
