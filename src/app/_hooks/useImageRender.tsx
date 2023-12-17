import { resizeImage } from '@/lib/image'
import { useEffect, useRef, useState } from 'react'

type ImageRenderState =
  | {
      isLoading: true
    }
  | {
      isLoading: false
      imageData: ImageData
    }

export const useImageRender = (
  imageBlob: Blob,
  maxWidth: number,
  maxHeight: number
) => {
  const [imageRenderState, setImageRenderState] = useState<ImageRenderState>({
    isLoading: true,
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvasRef.current?.getContext('2d', {
      willReadFrequently: true,
    })

    if (!context) return

    createImageBitmap(imageBlob).then((imageBitmap) => {
      const options = {
        imageHeight: imageBitmap.height,
        imageWidth: imageBitmap.width,
        maxHeight,
        maxWidth,
      }

      const { width, height } = resizeImage(options)

      context.canvas.width = width
      context.canvas.height = height

      context.drawImage(imageBitmap, 0, 0, width, height)

      setImageRenderState({
        isLoading: false,
        imageData: context.getImageData(0, 0, width, height),
      })
    })
  }, [canvasRef, maxWidth, maxHeight, imageBlob])

  return { imageRenderState, canvasRef }
}
