import React from 'react'
import { memo } from 'react'
import { ImageClassificationData } from '../types'

const ImageDetails = ({
  imageURL,
  predictions,
  description,
}: ImageClassificationData) => (
  <div>
    <img className="selected-image" src={imageURL} />
    {predictions.map(({ className, probability }, index) => (
      <li key={index}>
        {prettyPrintClassName(className)}: {prettyPrintPercentage(probability)}
      </li>
    ))}
    <p>{description}</p>
  </div>
)

export const MemoizedImageDetails = memo((data: ImageClassificationData) => (
  <ImageDetails {...data} />
))

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
