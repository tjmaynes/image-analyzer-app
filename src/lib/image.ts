import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import { load as loadModel, MobileNet } from '@tensorflow-models/mobilenet'
import { ImageClassificationData, ImageMetadata } from '../types.ts'
import db from '../data/db.json'

let cachedModel: MobileNet | null = null

const getMobileNet = async (): Promise<MobileNet> => {
  if (cachedModel) {
    return Promise.resolve(cachedModel)
  } else {
    cachedModel = await loadModel()
    return cachedModel
  }
}

export const classifyImage = async (
  imageMetadata: ImageMetadata
): Promise<ImageClassificationData> => {
  const model = await getMobileNet()

  const result: { probability: number; className: string }[] =
    await model.classify(imageMetadata.imageData)

  const sortedPredictions = Array.from(result)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5)

  const topClassification = sortedPredictions[0].className

  const background =
    db.data.find(({ name }) => name === topClassification)?.description ?? 'N/A'

  return {
    ...imageMetadata,
    topClassification: topClassification,
    predictions: sortedPredictions,
    background,
  }
}

export const getImageBlob = (imageSource: string) =>
  fetch(imageSource).then((response) => response.blob())

export const resizeImage = ({
  imageWidth,
  imageHeight,
  maxWidth,
  maxHeight,
}: {
  imageWidth: number
  imageHeight: number
  maxWidth: number
  maxHeight: number
}): { width: number; height: number } => {
  if (imageWidth > imageHeight && imageWidth > maxWidth) {
    return {
      width: maxWidth,
      height: imageHeight * (maxWidth / imageWidth),
    }
  } else if (imageHeight > maxHeight) {
    return {
      width: imageWidth * (maxHeight / imageHeight),
      height: maxHeight,
    }
  }
  return {
    width: imageWidth,
    height: imageHeight,
  }
}
