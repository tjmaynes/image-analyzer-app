import { useCallback, useEffect, useState } from 'react'
import { ImageCanvas } from './ImageCanvas'
import { ImageMetadata, ImageUploadInfo } from '../types'
import { useImageClassificationService } from '../hooks/useImageClassificationService'
import { useImageDescriptionService } from '../hooks/useImageDescriptionService'

export const ImageAnalysis = ({ imageId, imageBlob }: ImageUploadInfo) => {
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null)
  const [imageClassification, setImageClassification] = useState<string | null>(
    null
  )

  const onImageRenderCallback = useCallback(
    (imageData: ImageData) => {
      if (!imageMetadata) {
        setImageMetadata({
          imageId,
          imageBlob,
          imageData,
        })
      }
    },
    [imageId, imageBlob, imageMetadata, setImageMetadata]
  )

  const onImageClassificationCallback = useCallback(
    (classification: string) => {
      if (!imageClassification) {
        setImageClassification(classification)
      }
    },
    [imageClassification, setImageClassification]
  )

  return (
    <section className="flex flex-col md:flex-row p-6 justify-between">
      <ImageCanvas
        maxWidth={500}
        maxHeight={500}
        imageBlob={imageBlob}
        onRender={onImageRenderCallback}
      />
      <section className="flex flex-col mt-4 md:ml-6 sm:mt-0">
        <h2 className="text-2xl font-bold">Results</h2>
        {imageMetadata && (
          <ImageClassification
            imageMetadata={imageMetadata}
            onClassification={onImageClassificationCallback}
          />
        )}
        {imageClassification && (
          <ImageDescription classification={imageClassification} />
        )}
      </section>
    </section>
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
    <div className="pt-3 text-base">
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
    </div>
  )
}
