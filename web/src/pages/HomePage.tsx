import React, { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ImageAnalyzer, ImageUploader, MultiImageAnalyzer } from '../components'
import { loadImageQuery } from '../queries'
import { ImageUploadInfo } from '../types'

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

  return (
    <section>
      <div>
        <h1>Try it out</h1>
        <ImageUploader onUpload={processFiles} />
      </div>
      {images.length <= 0 && (
        <SampleImagePreview imageSource="/images/sample.jpg" />
      )}
      {images.length > 0 && <MultiImageAnalyzer images={images} />}
    </section>
  )
}

const SampleImagePreview = ({ imageSource }: { imageSource: string }) => {
  const { data, isLoading } = useQuery(loadImageQuery(imageSource))

  if (isLoading) return <progress></progress>
  return data ? (
    <div>
      <h1>Sample Analysis</h1>
      <ImageAnalyzer imageUploadInfo={data} />
    </div>
  ) : (
    <></>
  )
}
