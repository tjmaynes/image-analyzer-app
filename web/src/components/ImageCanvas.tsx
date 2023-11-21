import React, { useState, useEffect, useRef } from 'react'
import loadImage from 'blueimp-load-image'
import { ImageMetadata, ImageUploadInfo } from '../types'

type ImageCanvasProps = {
  imageUploadInfo: ImageUploadInfo
  onRender: (data: ImageMetadata) => void
}

export const ImageCanvas = ({
  imageUploadInfo,
  onRender,
}: ImageCanvasProps) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvasRef.current?.getContext('2d', {
      willReadFrequently: true,
    })

    if (!context) return

    loadImage(imageUploadInfo.imageBlob, { maxWidth: 500 }).then((image) => {
      const { width, height } = image.image

      context.canvas.width = width
      context.canvas.height = height

      context.drawImage(image.image, 0, 0, width, height)

      const imageData = context.getImageData(0, 0, width, height)

      onRender({
        ...imageUploadInfo,
        imageData: imageData,
      })

      setIsLoadingImage(false)
    })
  }, [canvasRef, imageUploadInfo])

  return (
    <>
      {isLoadingImage && <progress></progress>}
      <canvas ref={canvasRef} />
    </>
  )
}
