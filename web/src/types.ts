import { Option, Result } from 'ts-results'

export type ImageUploadInfo = { id: string; imageBlob: Blob }

export type ImageMetadata = ImageUploadInfo & {
  imageData: ImageData
}

export type Prediction = { className: string; probability: number }

export type ClassificationData = {
  predictions: Prediction[]
}

export type ImageClassificationData = ImageMetadata &
  ClassificationData & {
    background: string
  }

export type ImageClassificationResult = Result<ClassificationData, Error>

export interface IImageClassifierClient {
  classify(imageData: ImageData): Promise<ImageClassificationResult>
}

export type DescribeApiResponse = {
  data: { describe: { background: string } }
}

export interface IApiClient {
  describe(thing: string): Promise<Option<DescribeApiResponse>>
}

export type ImageAnalysisResult = Result<ImageClassificationData, Error>

export interface IImageAnalyzerClient {
  analyze(image: ImageMetadata): Promise<ImageAnalysisResult>
}

export type AppDependencies = { analyzerClient: IImageAnalyzerClient }
