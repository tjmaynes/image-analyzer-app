'use client'

import { useCallback, useEffect, useState } from 'react'
import ImageCanvas from './ImageCanvas'
import { ImageMetadata, ImageUploadInfo } from '@/app/types'
import { useImageClassificationService } from '../_hooks/useImageClassificationService'
import { useImageDescriptionService } from '../_hooks/useImageDescriptionService'

const ImageAnalyzer = ({ imageId, imageBlob }: ImageUploadInfo) => {
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null)
  const [imageClassification, setImageClassification] = useState<string | null>(
    null
  )

  const handleOnImageRender = useCallback(
    (imageData: ImageData) => {
      if (!imageMetadata) {
        const newImageMetadata = {
          imageId,
          imageBlob,
          imageData,
        }
        setImageMetadata(newImageMetadata)
      }
    },
    [imageId, imageBlob, imageMetadata, setImageMetadata]
  )

  const handleOnImageClassification = useCallback(
    (classification: string) => {
      if (!imageClassification) {
        setImageClassification(classification)
      }
    },
    [imageClassification, setImageClassification]
  )

  return (
    <div>
      <ImageCanvas
        maxWidth={500}
        maxHeight={500}
        imageBlob={imageBlob}
        onRender={handleOnImageRender}
      />
      <h2>Results</h2>
      {imageMetadata && (
        <ImageClassification
          imageMetadata={imageMetadata}
          onClassification={handleOnImageClassification}
        />
      )}
      {imageClassification && (
        <ImageDescription classification={imageClassification} />
      )}
    </div>
  )
}

const ImageClassification = ({
  imageMetadata,
  onClassification,
}: {
  imageMetadata: ImageMetadata
  onClassification: (classification: string) => void
}) => {
  const { imageClassificationResult } = useImageClassificationService(
    imageMetadata.imageData
  )

  useEffect(() => {
    if (imageClassificationResult.state === 'FINISHED_LOADING_CLASSIFICATION') {
      onClassification(imageClassificationResult.classification.top)
    }
  })

  const prettyPrintClassName = (className: string) =>
    className
      .split(' ')
      .map((word) => capitalizeWord(word))
      .join(' ')

  const capitalizeWord = (word: string): string =>
    word.length <= 2 ? word : `${word[0].toUpperCase()}${word.substring(1)}`

  const prettyPrintPercentage = (probability: number) =>
    `${(probability * 100).toFixed(0)}%`

  return (
    <>
      {imageClassificationResult.state === 'LOADING_MODEL' && (
        <progress></progress>
      )}
      {imageClassificationResult.state ===
        'FINISHED_LOADING_CLASSIFICATION' && (
        <ul>
          {imageClassificationResult.classification.predictions.map(
            ({ className, probability }, index: number) => (
              <li key={index}>
                {prettyPrintClassName(className)}:{' '}
                {prettyPrintPercentage(probability)}
              </li>
            )
          )}
        </ul>
      )}
      {(imageClassificationResult.state === 'ERROR_LOADING_MODEL' ||
        imageClassificationResult.state === 'ERROR_LOADING_CLASSIFICATION') && (
        <p aria-labelledby="prediction-info">
          An error occurred: {imageClassificationResult.message}
        </p>
      )}
    </>
  )
}

const ImageDescription = ({ classification }: { classification: string }) => {
  const { imageDescriptionResult } = useImageDescriptionService(classification)

  return (
    <>
      {imageDescriptionResult.state === 'LOADING' && <progress></progress>}
      {imageDescriptionResult.state === 'FINISHED' && (
        <p aria-labelledby="background-info">
          {imageDescriptionResult.description}
        </p>
      )}
      {imageDescriptionResult.state === 'ERROR' && (
        <p aria-labelledby="background-info">
          An error occurred: {imageDescriptionResult.message}
        </p>
      )}
    </>
  )
}

export default ImageAnalyzer
