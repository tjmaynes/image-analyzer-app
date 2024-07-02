import { useImageRender as useImageRenderer } from '../hooks/useImageRender'
import { useEffect } from 'react'

type ImageCanvasProps = {
  maxWidth: number
  maxHeight: number
  imageBlob: Blob
  onRender: (data: ImageData) => void
}

export const ImageCanvas = ({
  maxWidth,
  maxHeight,
  imageBlob,
  onRender,
}: ImageCanvasProps) => {
  const { canvasRef, imageRenderState } = useImageRenderer(
    imageBlob,
    maxWidth,
    maxHeight
  )

  useEffect(() => {
    if (!imageRenderState.isLoading) onRender(imageRenderState.imageData)
  }, [imageRenderState, onRender])

  return (
    <>
      {imageRenderState.isLoading && <progress></progress>}
      <canvas ref={canvasRef} />
    </>
  )
}
