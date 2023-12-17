'use client'

import { useCallback, useState } from 'react'
import ImageCanvas from './ImageCanvas'
import ImageDescription from './ImageDescription'
import { ImageMetadata, ImageUploadInfo } from '@/app/image-analyzer/types'

const ImageAnalyzer = ({ imageId, imageBlob }: ImageUploadInfo) => {
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null)

  const handleOnImageRender = useCallback(
    (imageData: ImageData) => {
      if (!imageMetadata) {
        const newImageMetadata = {
          imageId,
          imageBlob,
          imageData,
        }
        setImageMetadata(newImageMetadata)
      }
    },
    [imageId, imageBlob, imageMetadata, setImageMetadata]
  )

  return (
    <div className="grid">
      <ImageCanvas
        maxWidth={500}
        maxHeight={500}
        imageBlob={imageBlob}
        onRender={handleOnImageRender}
      />
      {imageMetadata && <ImageDescription imageMetadata={imageMetadata} />}
    </div>
  )
}

export default ImageAnalyzer
