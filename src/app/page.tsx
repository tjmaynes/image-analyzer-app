'use client'

import { useCallback, useState } from 'react'
import ImageUploader from '@/app/_components/ImageUploader'
import SampleImagePreview from '@/app/_components/SampleImagePreview'
import BackgroundInfo from '@/app/_components/BackgroundInfo'
import ImageAnalyzer from '@/app/_components/ImageAnalyzer'
import { ImageUploadInfo } from '@/app/types'

const ImageAnalyzerRoot = () => {
  const [images, setImages] = useState<ImageUploadInfo[]>([])

  const processFiles = useCallback(
    (images: ImageUploadInfo[]) => {
      if (images.length > 0) setImages(images)
    },
    [setImages]
  )

  return (
    <main>
      <div className="welcome">
        <BackgroundInfo />
        <ImageUploader onUpload={processFiles} />
      </div>
      {images.length <= 0 && (
        <SampleImagePreview imageSource="/images/sample.jpg" />
      )}
      {images.length > 0 && (
        <div>
          <h2>Analysis Results</h2>
          {images.map((data, index) => (
            <ImageAnalyzer key={index} {...data} />
          ))}
        </div>
      )}
    </main>
  )
}

export default ImageAnalyzerRoot
