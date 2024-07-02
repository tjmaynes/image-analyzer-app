import { ImageUploadInfo } from '../types'
import { useEffect, useState } from 'react'

export const useImageUploadInfoFetcher = (imageSource: string) => {
  const [imageUploadInfo, setImageUploadInfo] =
    useState<ImageUploadInfo | null>()

  useEffect(() => {
    if (!imageUploadInfo) {
      fetch(imageSource)
        .then((response) => response.blob())
        .then((blob) => {
          setImageUploadInfo({
            imageId: imageSource,
            imageBlob: blob,
          })
        })
    }
  }, [imageSource, imageUploadInfo])

  if (imageUploadInfo === undefined || !imageUploadInfo) return null

  return { ...imageUploadInfo }
}
