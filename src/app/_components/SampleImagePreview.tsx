import { memo } from 'react'
import { useImageUploadInfoFetcher } from '@/app/_hooks/useImageUploadInfoFetcher'
import ImageAnalyzer from './ImageAnalyzer'

const SampleImagePreview = memo(({ imageSource }: { imageSource: string }) => {
  const imageUploadInfo = useImageUploadInfoFetcher(imageSource)

  return (
    <div>
      <h2>Sample Analysis</h2>
      {imageUploadInfo && <ImageAnalyzer {...imageUploadInfo} />}
    </div>
  )
})

SampleImagePreview.displayName = 'SampleImagePreview'

export default SampleImagePreview
