import React, { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ImageCanvas } from './ImageCanvas'
import { ImageMetadata, ImageUploadInfo } from '../types'
import { analyzeImageQuery } from '../queries'

type ImageAnalyzerProps = { imageUploadInfo: ImageUploadInfo }

export const ImageAnalyzer = ({ imageUploadInfo }: ImageAnalyzerProps) => {
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null)

  const handleOnImageRender = useCallback(
    (imageMetadata: ImageMetadata) => {
      setImageMetadata(imageMetadata)
    },
    [imageMetadata]
  )

  return (
    <div className="grid">
      <ImageCanvas
        imageUploadInfo={imageUploadInfo}
        onRender={handleOnImageRender}
      />
      {imageMetadata && <ImageDescription imageMetadata={imageMetadata} />}
    </div>
  )
}

const ImageDescription = ({
  imageMetadata,
}: {
  imageMetadata: ImageMetadata
}) => {
  const { data, isLoading } = useQuery(analyzeImageQuery(imageMetadata))

  return (
    <hgroup>
      <h3>Predictions</h3>
      {!isLoading && data ? (
        <ul>
          {data.predictions.map(({ className, probability }, index) => (
            <li key={index}>
              {prettyPrintClassName(className)}:{' '}
              {prettyPrintPercentage(probability)}
            </li>
          ))}
        </ul>
      ) : (
        <progress></progress>
      )}
      <h3>Background</h3>
      {!isLoading && data ? (
        <p aria-labelledby="background-info">{data.background}</p>
      ) : (
        <progress></progress>
      )}
    </hgroup>
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
