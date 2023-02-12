import React, { useReducer, useEffect, useRef } from 'react'
import { BeatLoader } from 'react-spinners'
import { ImageMetadata } from '../types'

type ImageCanvasProps = {
  imageFile: Blob
  onRender: (data: ImageMetadata) => void
}

export const ImageCanvas = ({ imageFile, onRender }: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [
    {
      isLoadingImage,
      imageBitmap,
      imageData,
      imageURL,
      imageHeight,
      imageWidth,
    },
    dispatch,
  ] = useReducer(reducer, {
    isLoadingImage: true,
    imageData: null,
    imageBitmap: null,
    imageURL: null,
    imageWidth: 0,
    imageHeight: 0,
  })

  useEffect(() => {
    createImageBitmap(imageFile).then((imageBitmap) => {
      dispatch({
        type: Action.ReadyToRenderImage,
        imageBitmap,
      })
    })
  }, [imageFile])

  useEffect(() => {
    if (!imageBitmap) return

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvasRef.current?.getContext('2d', {
      willReadFrequently: true,
    })

    if (!context) return

    const { width, height } = resize(imageBitmap.width, imageBitmap.height)

    context.canvas.width = width
    context.canvas.height = height

    context.drawImage(imageBitmap, 0, 0, width, height)

    const imageData = context.getImageData(0, 0, width, height)

    dispatch({
      type: Action.FinishedRenderingImage,
      imageData: imageData,
      imageURL: canvas.toDataURL(),
      imageWidth: width,
      imageHeight: height,
    })
  }, [imageBitmap, canvasRef])

  useEffect(() => {
    if (imageData && imageURL)
      onRender({
        name: imageFile.name,
        imageData: imageData,
        imageURL: imageURL,
        imageDimensions: {
          width: imageWidth,
          height: imageHeight,
        },
      })
  }, [imageData, imageURL])

  return (
    <>
      {isLoadingImage && (
        <BeatLoader
          color="#189a92"
          loading={isLoadingImage}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
      {!isLoadingImage && (
        <canvas
          ref={canvasRef}
          hidden={imageBitmap !== null}
          width={imageWidth}
          height={imageHeight}
        />
      )}
    </>
  )
}

enum Action {
  LoadingImage = 'Loading image',
  ReadyToRenderImage = 'Ready to render image',
  FinishedRenderingImage = 'Finished rendering image',
}

type ImageRenderAction =
  | { type: Action.LoadingImage }
  | { type: Action.ReadyToRenderImage; imageBitmap: ImageBitmap }
  | {
      type: Action.FinishedRenderingImage
      imageData: ImageData
      imageURL: string
      imageWidth: number
      imageHeight: number
    }

type ImageRenderState = {
  isLoadingImage: boolean
  imageBitmap: ImageBitmap | null
  imageData: ImageData | null
  imageURL: string | null
  imageWidth: number
  imageHeight: number
}

const reducer = (
  state: ImageRenderState,
  action: ImageRenderAction
): ImageRenderState => {
  switch (action.type) {
    case Action.LoadingImage:
      return {
        ...state,
        isLoadingImage: true,
      }
    case Action.ReadyToRenderImage:
      return {
        ...state,
        isLoadingImage: false,
        imageBitmap: action.imageBitmap,
      }
    case Action.FinishedRenderingImage:
      return {
        ...state,
        isLoadingImage: false,
        imageData: action.imageData,
        imageURL: action.imageURL,
        imageWidth: action.imageWidth,
        imageHeight: action.imageHeight,
      }
    default:
      return state
  }
}

const resize = (
  width: number,
  height: number
): { width: number; height: number } => {
  const MAX_WIDTH = 500
  const MAX_HEIGHT = 500

  if (width > height && width > MAX_WIDTH) {
    height = height * (MAX_WIDTH / width)
    width = MAX_WIDTH
  } else if (height > MAX_HEIGHT) {
    width = width * (MAX_HEIGHT / height)
    height = MAX_HEIGHT
  }

  return { width, height }
}
