import React, { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ImageCanvas } from './ImageCanvas'
import { ImageMetadata, ImageUploadInfo } from '../types'
import { analyzeImageQuery } from '../queries'
import { LoadingSpinner } from './LoadingSpinner'

type ImageAnalyzerProps = { imageUploadInfo: ImageUploadInfo }

export const ImageAnalyzer = ({ imageUploadInfo }: ImageAnalyzerProps) => {
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null)

  const handleOnImageRender = useCallback(
    (imageMetadata) => {
      setImageMetadata(imageMetadata)
    },
    [imageMetadata]
  )

  return (
    <>
      {imageMetadata && (
        <ImageAnalyzerContainer imageMetadata={imageMetadata} />
      )}
      {!imageMetadata && (
        <ImageCanvas
          imageUploadInfo={imageUploadInfo}
          onRender={handleOnImageRender}
        />
      )}
    </>
  )
}

const ImageAnalyzerContainer = ({
  imageMetadata,
}: {
  imageMetadata: ImageMetadata
}) => {
  const { data, isLoading } = useQuery(analyzeImageQuery(imageMetadata))

  return (
    <>
      {isLoading && <LoadingSpinner isLoading={isLoading} />}
      {data && (
        <div className="image-analysis-container">
          <div className="image-analysis-image-container">
            <img
              src={data.imageURL}
              width={data.imageDimensions.width}
              height={data.imageDimensions.height}
            />
          </div>
          <section className="image-analysis-metadata-container">
            <div>
              <h2>Predictions</h2>
              <ul className="predictions">
                {data.predictions.map(({ className, probability }, index) => (
                  <li key={index}>
                    {prettyPrintClassName(className)}:{' '}
                    {prettyPrintPercentage(probability)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Background</h2>
              <p>{data.description}</p>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

const prettyPrintClassName = (className: string) =>
  className
    .split(' ')
    .map((word) => capitalizeWord(word))
    .join(' ')

const capitalizeWord = (word: string): string => {
  if (word.length <= 2) return word
  return `${word[0].toUpperCase()}${word.substring(1)}`
}

const prettyPrintPercentage = (probability: number) =>
  `${(probability * 100).toFixed(0)}%`
