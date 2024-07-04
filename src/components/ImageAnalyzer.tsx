import { useEffect, useState } from 'react'
import { ImageUploader } from './ImageUploader.tsx'
import { ImageAnalysis } from './ImageAnalysis.tsx'
import { ImageUploadInfo } from '../types.ts'
import { getImageBlob } from '../lib/image.ts'

const ImageAnalyzer = ({ initialImage }: { initialImage: string }) => {
  const [images, setImages] = useState<ImageUploadInfo[]>([])

  useEffect(() => {
    if (images.length <= 1) {
      getImageBlob(initialImage).then((blob) => {
        setImages([
          {
            imageId: initialImage,
            imageBlob: blob,
          },
        ])
      })
    }
  }, [initialImage, images.length])

  const processFiles = (newImages: ImageUploadInfo[]) => {
    if (newImages.length > 0) setImages([...images, ...newImages])
  }

  return (
    <>
      <ImageUploader onUpload={(images) => processFiles(images)} />
      {images.map((data) => (
        <ImageAnalysis key={data.imageId} {...data} />
      ))}
    </>
  )
}

export default ImageAnalyzer
