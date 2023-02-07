import React, { useReducer, useEffect, useRef } from 'react'
import { BeatLoader } from 'react-spinners'

type ImageCanvasProps = {
  imageFile: Blob
  onRender: (data: ImageData) => void
}

export const ImageCanvas = ({ imageFile, onRender }: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [{ isLoadingImage, imageBitmap, imageData, imageURL }, dispatch] =
    useReducer(reducer, {
      isLoadingImage: true,
      imageData: null,
      imageBitmap: null,
      imageURL: null,
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

    context.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height)
    const imageData = context.getImageData(
      0,
      0,
      imageBitmap.width,
      imageBitmap.height
    )

    dispatch({
      type: Action.FinishedRenderingImage,
      imageData: imageData,
      imageURL: canvas.toDataURL(),
    })
  }, [imageBitmap, canvasRef])

  useEffect(() => {
    if (imageData) onRender(imageData)
  }, [imageData])

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
      {!isLoadingImage && imageURL && imageBitmap && (
        <img src={imageURL} width={300} />
      )}
      {
        <canvas
          hidden={imageBitmap !== null}
          ref={canvasRef}
          width={imageBitmap?.width || 0}
          height={imageBitmap?.height || 0}
        />
      }
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
    }

type ImageRenderState = {
  isLoadingImage: boolean
  imageBitmap: ImageBitmap | null
  imageData: ImageData | null
  imageURL: string | null
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
      }
    default:
      return state
  }
}
