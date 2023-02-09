import React from 'react'
import { ImageClassificationData } from '../types'

type AnalysisContainerProps = {
  data: ImageClassificationData
}

export const ImageAnalysisContainer = ({ data }: AnalysisContainerProps) => {
  return (
    <div className="image-analysis-container">
      <div className="image-analysis-image-container">
        <img
          src={data.imageURL}
          width={data.imageDimensions.width}
          height={data.imageDimensions.height}
        />
      </div>
      <div className="image-analysis-metadata-container">
        <section>
          <h2>Predictions</h2>
          <ul className="predictions">
            {data.predictions.map(({ className, probability }, index) => (
              <li key={index}>
                {prettyPrintClassName(className)}:{' '}
                {prettyPrintPercentage(probability)}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Background</h2>
          <p>{data.description}</p>
        </section>
      </div>
    </div>
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
