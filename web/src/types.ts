import { Option, Result } from 'ts-results'

export type ImageUploadInfo = { id: string; imageBlob: Blob }

export type ImageMetadata = ImageUploadInfo & {
  imageData: ImageData
  imageURL: string
  imageDimensions: { width: number; height: number }
}

export type Prediction = { className: string; probability: number }

export type ClassificationData = {
  predictions: Prediction[]
}

export type ImageClassificationData = ImageMetadata &
  ClassificationData & {
    description: string
  }

export interface IImageClassifierClient {
  classify(imageData: ImageData): Promise<Result<ClassificationData, Error>>
}

export type DescribeApiResponse = {
  data: { describe: { description: string } }
}

export interface IApiClient {
  describe(thing: string): Promise<Option<DescribeApiResponse>>
}

export interface IImageAnalyzerClient {
  analyze(image: ImageMetadata): Promise<Result<ImageClassificationData, Error>>
}
