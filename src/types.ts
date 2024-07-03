export type ImageUploadInfo = {
  imageId: string
  imageBlob: Blob
}

export type ImageMetadata = ImageUploadInfo & {
  imageData: ImageData
}

export type Prediction = { className: string; probability: number }

export type Classification = {
  top: string
  predictions: Prediction[]
}
