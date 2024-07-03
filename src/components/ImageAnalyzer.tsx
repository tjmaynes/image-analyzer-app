import { ImageUploadInfo } from '../types.ts'
import { ImageUploader } from './ImageUploader.tsx'
import { ImageAnalysis } from './ImageAnalysis.tsx'
import { useImageAnalyzer } from '../hooks/useImageAnalyzer.tsx'

const ImageAnalyzer = () => {
  const { images, setImages } = useImageAnalyzer('/images/sample.jpg')

  const processFiles = (images: ImageUploadInfo[]) => {
    if (images.length > 0) setImages(images)
  }

  return (
    <main>
      {images.map((data) => (
        <ImageAnalysis key={data.imageId} {...data} />
      ))}
      <ImageUploader onUpload={(images) => processFiles(images)} />
    </main>
  )
}

export default ImageAnalyzer
