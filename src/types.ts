export type ImageUploadInfo = {
  imageId: string
  imageBlob: Blob
}

export type ImageMetadata = ImageUploadInfo & {
  imageData: ImageData
}

export type Prediction = { className: string; probability: number }

export type Classification = {
  topClassification: string
  predictions: Prediction[]
}

export type ImageClassificationData = ImageMetadata &
  Classification & {
    background: string
  }
