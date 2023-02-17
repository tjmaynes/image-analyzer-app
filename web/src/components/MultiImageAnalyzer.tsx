import React, { memo } from 'react'
import { ImageUploadInfo } from '../types'
import { ImageAnalyzer } from './ImageAnalyzer'

const MemoizedImageAnalyzer = memo(
  (props: { imageUploadInfo: ImageUploadInfo }) => <ImageAnalyzer {...props} />
)

export const MultiImageAnalyzer = ({
  images,
}: {
  images: ImageUploadInfo[]
}) => (
  <div>
    <h1>Analysis Results</h1>
    {images.map((data, index) => (
      <MemoizedImageAnalyzer key={index} imageUploadInfo={data} />
    ))}
  </div>
)
