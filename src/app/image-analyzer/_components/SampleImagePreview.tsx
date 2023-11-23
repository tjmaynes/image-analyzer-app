import { memo } from 'react'
import { useImageUploadInfoFetcher } from '@/app/image-analyzer/_hooks/useImageUploadInfoFetcher'
import ImageAnalyzer from './ImageAnalyzer'

const SampleImagePreview = memo(({ imageSource }: { imageSource: string }) => {
  const imageUploadInfo = useImageUploadInfoFetcher(imageSource)

  return (
    <div>
      <h1>Sample Analysis</h1>
      {imageUploadInfo && <ImageAnalyzer {...imageUploadInfo} />}
    </div>
  )
})

SampleImagePreview.displayName = 'SampleImagePreview'

export default SampleImagePreview
