import { useImageAnalyzer } from '@/app/_hooks/useImageAnalyzer'
import { ImageMetadata } from '@/app/image-analyzer/types'

const ImageDescription = ({
  imageMetadata,
}: {
  imageMetadata: ImageMetadata
}) => {
  const { imageClassifier } = useImageAnalyzer(imageMetadata.imageData)

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
    <hgroup>
      <h3>Predictions</h3>
      {imageClassifier.state === 'FINISHED_PREDICTIONS' && (
        <ul>
          {imageClassifier.predictions.map(
            ({ className, probability }, index: number) => (
              <li key={index}>
                {prettyPrintClassName(className)}:{' '}
                {prettyPrintPercentage(probability)}
              </li>
            )
          )}
        </ul>
      )}
      {imageClassifier.state !== 'FINISHED_PREDICTIONS' && (
        <progress></progress>
      )}
      <h3>Background</h3>
      {imageClassifier.state === 'FINISHED' && (
        <p aria-labelledby="background-info">{imageClassifier.description}</p>
      )}
      {imageClassifier.state !== 'FINISHED' && <progress></progress>}
    </hgroup>
  )
}

export default ImageDescription
