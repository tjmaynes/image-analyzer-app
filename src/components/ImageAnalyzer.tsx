import { useState } from 'react'
import { ImageUploadInfo } from '../types.ts'
import { ImageUploader } from './ImageUploader.tsx'
import { SampleImagePreview } from './SampleImagePreview.tsx'
import { ImageAnalysis } from './ImageAnalysis.tsx'

const ImageAnalyzer = () => {
  const [images, setImages] = useState<ImageUploadInfo[]>([])

  const processFiles = (images: ImageUploadInfo[]) => {
    if (images.length > 0) setImages(images)
  }

  return (
    <main>
      <ImageUploader onUpload={(images) => processFiles(images)} />
      <div>
        {images.length <= 0 && (
          <SampleImagePreview imageSource="/images/sample.jpg" />
        )}
        {images.length > 0 && (
          <>
            <h2>Analysis Results</h2>
            {images.map((data, index) => (
              <ImageAnalysis key={index} {...data} />
            ))}
          </>
        )}
      </div>
    </main>
  )
}

export default ImageAnalyzer
