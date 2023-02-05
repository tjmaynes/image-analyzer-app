import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { Result, Ok, Err } from 'ts-results'
import {
  ClassificationData,
  ImageClassificationData,
  ImageMetadata,
} from './types'

export const loadModel = async (): Promise<mobilenet.MobileNet> =>
  await mobilenet.load()

export const readAndClassifyImageBuilder =
  (host: string) =>
  async (
    imageFile: Blob,
    model: mobilenet.MobileNet
  ): Promise<Result<ImageClassificationData, Error>> => {
    const rawImageResult = await readRawImageFile(imageFile)
    if (rawImageResult.ok) {
      const classificationResult = await classifyImage(
        rawImageResult.val,
        model
      )
      if (classificationResult.ok) {
        const descriptionResult = await generateImageDescription(
          classificationResult.val.predictions[0].className,
          host
        )
        return new Ok({
          ...rawImageResult.val,
          ...classificationResult.val,
          ...descriptionResult,
        })
      } else {
        return classificationResult
      }
    } else {
      return rawImageResult
    }
  }

const generateImageDescription = async (
  imageContext: string,
  host: string
): Promise<{ description: string }> =>
  await fetch(`${host}/conversation`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      context: imageContext,
    }),
  }).then((resp) => resp.json())

const classifyImage = async (
  imageMetadata: ImageMetadata,
  model: mobilenet.MobileNet
): Promise<Result<ClassificationData, Error>> =>
  model
    .classify(imageMetadata.imageData)
    .then(
      (predictions) =>
        new Ok({
          name: imageMetadata.name,
          predictions: Array.from(predictions)
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 5),
        })
    )
    .catch((e) => new Err(e))

const readRawImageFile = async (
  imageFile: Blob
): Promise<Result<ImageMetadata, Error>> => {
  const buffer = await readFile(imageFile)
  const imageData = await getImageData(imageFile)
  if (!imageData) return new Err(new Error('Unable to process received image'))

  const imageURL = toURLString(buffer, imageFile.type)
  return new Ok({ name: imageFile.name, imageData: imageData, imageURL })
}

const readFile = (blob: Blob): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      if (e.target?.result) resolve(e.target.result as ArrayBuffer)
      else reject('Unable to render file')
    }
    fileReader.readAsArrayBuffer(blob)
  })

const toURLString = (buffer: ArrayBuffer, type: string): string => {
  const blob = new Blob([buffer], { type: type })
  return URL.createObjectURL(blob)
}

const getImageData = async (fileBlob: Blob): Promise<ImageData | null> => {
  const bitmap = await createImageBitmap(fileBlob)
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const context = canvas.getContext('2d')
  if (!context) return null

  context.drawImage(bitmap, 0, 0)
  return context.getImageData(0, 0, bitmap.width, bitmap.height)
}
