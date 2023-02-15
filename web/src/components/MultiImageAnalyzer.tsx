import React, { memo } from 'react'
import { ImageUploadInfo } from '../types'
import { ImageAnalyzer } from './ImageAnalyzer'
import { RefreshButton } from './RefreshButton'

const MemoizedImageAnalyzer = memo(
  (props: { ImageUploadInfo: ImageUploadInfo }) => <ImageAnalyzer {...props} />
)

export const MultiImageAnalyzer = ({
  images,
}: {
  images: ImageUploadInfo[]
}) => (
  <>
    <RefreshButton />
    <section className="image-analyzer-container">
      {images.map((data, index) => (
        <MemoizedImageAnalyzer key={index} ImageUploadInfo={data} />
      ))}
    </section>
  </>
)
