import { Err, Ok, Result } from 'ts-results'
import {
  IApiClient,
  IImageAnalyzerClient,
  IImageClassifierClient,
  ImageClassificationData,
  ImageMetadata,
} from '../types'

export class ImageAnalyzerClient implements IImageAnalyzerClient {
  private readonly imageClassifierClient: IImageClassifierClient
  private readonly apiClient: IApiClient

  constructor(
    imageClassifierClient: IImageClassifierClient,
    apiClient: IApiClient
  ) {
    this.imageClassifierClient = imageClassifierClient
    this.apiClient = apiClient
  }

  analyze = async (
    image: ImageMetadata
  ): Promise<Result<ImageClassificationData, Error>> => {
    const classificationData = await this.imageClassifierClient.classify(image)
    if (classificationData.ok) {
      const inferrence = await this.apiClient.infer(
        classificationData.val.predictions[0].className
      )
      if (inferrence.some) {
        return Ok({
          ...image,
          ...classificationData.val,
          ...inferrence.val,
        })
      } else {
        return Err(new Error(`Couldn't infer image: ${image.name}`))
      }
    } else {
      return classificationData
    }
  }
}
