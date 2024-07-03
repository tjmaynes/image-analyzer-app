import { useEffect, useState } from 'react'
import { ImageUploadInfo } from '../types.ts'

export const useImageAnalyzer = (initialImage: string) => {
  const [images, setImages] = useState<ImageUploadInfo[]>([])

  useEffect(() => {
    if (images.length <= 0) {
      fetch(initialImage)
        .then((response) => response.blob())
        .then((blob) => {
          setImages([
            {
              imageId: initialImage,
              imageBlob: blob,
            },
          ])
        })
    }
  }, [initialImage, images.length])

  return { images, setImages }
}
