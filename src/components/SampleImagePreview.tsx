import { memo } from 'react'
import { useImageUploadInfoFetcher } from '../hooks/useImageUploadInfoFetcher'
import { ImageAnalysis } from './ImageAnalysis.tsx'

export const SampleImagePreview = memo(
  ({ imageSource }: { imageSource: string }) => {
    const imageUploadInfo = useImageUploadInfoFetcher(imageSource)

    return (
      <div>
        <h2>Sample Analysis</h2>
        {imageUploadInfo && <ImageAnalysis {...imageUploadInfo} />}
      </div>
    )
  }
)
