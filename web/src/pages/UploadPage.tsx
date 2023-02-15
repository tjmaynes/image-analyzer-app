import React, { useCallback, useState } from 'react'
import { ImageUploader, MultiImageAnalyzer } from '../components'
import { ImageUploadInfo } from '../types'

export const UploadPage = () => {
  const [images, setImages] = useState<ImageUploadInfo[]>([])

  const processFiles = useCallback(
    (images: Blob[]) => {
      setImages(
        images.map((imageBlob) => ({
          id: imageBlob.name,
          imageBlob,
        }))
      )
    },
    [images, setImages]
  )

  return (
    <>
      {images.length <= 0 && <ImageUploader onUpload={processFiles} />}
      {images.length > 0 && <MultiImageAnalyzer images={images} />}
    </>
  )
}
