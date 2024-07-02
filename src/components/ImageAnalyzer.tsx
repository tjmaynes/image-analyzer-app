import { useCallback, useState } from 'react'
import { ImageUploadInfo } from '../types.ts'
import { BackgroundInfo } from './BackgroundInfo.tsx'
import { ImageUploader } from './ImageUploader.tsx'
import { SampleImagePreview } from './SampleImagePreview.tsx'

const ImageAnalyzer = () => {
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

export default ImageAnalyzer
