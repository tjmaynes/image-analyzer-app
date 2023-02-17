import React, { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ImageAnalyzer, ImageUploader, MultiImageAnalyzer } from '../components'
import { loadImageQuery } from '../queries'
import { ImageUploadInfo } from '../types'

const SampleImagePreview = ({ imageSource }: { imageSource: string }) => {
  const { data, isLoading } = useQuery(loadImageQuery(imageSource))

  if (isLoading) return <progress></progress>
  return data ? <ImageAnalyzer imageUploadInfo={data} /> : <></>
}

export const HomePage = () => {
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

  if (images.length <= 0)
    return (
      <section>
        <SampleImagePreview imageSource="/images/sample.jpg" />
        <ImageUploader onUpload={processFiles} />
      </section>
    )

  return (
    <section>
      <MultiImageAnalyzer images={images} />
    </section>
  )
}
