/* eslint-disable no-restricted-globals */
import { ImageMetadata, ImageProcessingResults } from '../../types'

self.onmessage = (e: MessageEvent<FileList>) => {
  readRawImageFiles(e.data).then((result) => {
    self.postMessage(result)
  })
}

const readRawImageFiles = async (
  imageFiles: FileList
): Promise<ImageProcessingResults> => {
  const data: ImageMetadata[] = []
  const errors: Error[] = []
  for (let i = 0; i < imageFiles.length; i++) {
    const result = await readRawImageFile(imageFiles[i])
    if (result.data) data.push(result.data)
    else if (result.error) errors.push(result.error)
  }
  return { data, errors }
}

const readRawImageFile = async (
  imageFile: Blob
): Promise<{ data?: ImageMetadata; error?: Error }> => {
  const buffer = await readFile(imageFile)
  const imageData = await getImageData(imageFile)
  if (!imageData)
    return { error: new Error('Unable to process received image') }

  const imageURL = toURLString(buffer, imageFile.type)
  const imageMetadata = { name: imageFile.name, imageData, imageURL }
  return { data: imageMetadata }
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

export {}
