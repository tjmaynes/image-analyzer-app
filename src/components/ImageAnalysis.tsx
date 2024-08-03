import { ImageCanvas } from './ImageCanvas'
import { ImageUploadInfo, Prediction } from '../types'
import { ImageAnalysisStates, useImageAnalysis } from '../hooks/useImageAnalysis.tsx'

export const ImageAnalysis = (imageUploadInfo: ImageUploadInfo) => {
  const { state, onImageRenderCallback } = useImageAnalysis(imageUploadInfo)

  return (
    <section className='flex flex-col justify-center md:flex-row py-6 first:pt-6'>
      <ImageCanvas
        maxWidth={400}
        maxHeight={400}
        imageBlob={imageUploadInfo.imageBlob}
        onRender={onImageRenderCallback}
      />
      {state.state === ImageAnalysisStates.FINISHED && (
        <section className='flex flex-col md:max-w-[400px] mt-8 md:ml-6 md:mt-0'>
          <h3 className='text-xl font-bold'>I'm a {state.classification.topClassification}!</h3>
          <p className='text-sm py-3'>{state.classification.background}</p>
          <p className='text-sm italic' aria-labelledby='background-info'>
            {getOtherPossibilities(state.classification.predictions.slice(1))}{' '}
          </p>
        </section>
      )}
      {state.state === ImageAnalysisStates.ERROR && (
        <p aria-labelledby='prediction-info'>An error occurred: {state.message}</p>
      )}
    </section>
  )
}

const getOtherPossibilities = (predictions: Prediction[]): string => {
  console.log(predictions[0].probability * 100)
  if (predictions.length > 0 && predictions[0].probability * 100 <= 50) return ''

  return predictions.reduce((previousValue, currentValue, currentIndex, array) => {
    const className = prettyPrintClassName(currentValue.className)
    const probability = prettyPrintProbability(currentValue.probability)

    if (currentIndex === 0)
      return `${previousValue} a ${probability} probability that I'm a '${className}'`
    else if (currentIndex === 1 && array.length == 2)
      return `${previousValue} and a ${probability} probability I'm a '${className}'.`
    else if (currentIndex < array.length - 1)
      return `${previousValue}, a ${probability} probability that I'm a '${className}'`
    else return `${previousValue}, and a ${probability} probability I'm a '${className}'.`
  }, "There's")
}

const prettyPrintClassName = (className: string) =>
  className
    .split(' ')
    .map((word) => capitalizeWord(word))
    .join(' ')
    .split(',')[0]

const capitalizeWord = (word: string): string =>
  word.length <= 2 ? word : `${word[0].toUpperCase()}${word.substring(1)}`

const prettyPrintProbability = (probability: number) => `${(probability * 100).toFixed(0)}%`
