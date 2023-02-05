import { MobileNet } from '@tensorflow-models/mobilenet'
import { Result } from 'ts-results'

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
