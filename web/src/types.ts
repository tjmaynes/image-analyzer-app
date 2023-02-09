import { MobileNet } from '@tensorflow-models/mobilenet'
import { Option, Result } from 'ts-results'

export type ImageProcessingResults = { data: ImageMetadata[]; errors: Error[] }

export type ImageMetadata = {
  name: string
  imageData: ImageData
  imageURL: string
  imageDimensions: { width: number; height: number }
}

export type Prediction = { className: string; probability: number }

export type ClassificationData = {
  name: string
  predictions: Prediction[]
}

export type ImageClassificationData = ImageMetadata &
  ClassificationData & {
    description: string
  }

export interface IImageClassifierClient {
  classify(
    imageMetadata: ImageMetadata,
    model: MobileNet
  ): Promise<Result<ClassificationData, Error>>
}

export type DescribeApiResponse = {
  data: { describe: { description: string } }
}

export interface IApiClient {
  describe(thing: string): Promise<Option<DescribeApiResponse>>
}

export interface IImageAnalyzerClient {
  analyze(
    image: ImageMetadata,
    model: MobileNet
  ): Promise<Result<ImageClassificationData, Error>>
}
