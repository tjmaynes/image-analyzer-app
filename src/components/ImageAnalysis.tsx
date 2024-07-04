import { ImageCanvas } from './ImageCanvas'
import { ImageUploadInfo } from '../types'
import {
  ImageAnalysisStates,
  useImageAnalysis,
} from '../hooks/useImageAnalysis.tsx'

export const ImageAnalysis = (imageUploadInfo: ImageUploadInfo) => {
  const { state, onImageRenderCallback } = useImageAnalysis(imageUploadInfo)

  return (
    <section className="flex flex-col md:flex-row py-6 first:pt-6">
      <ImageCanvas
        maxWidth={400}
        maxHeight={400}
        imageBlob={imageUploadInfo.imageBlob}
        onRender={onImageRenderCallback}
      />
      {state.state === ImageAnalysisStates.FINISHED ? (
        <section className="flex flex-col justify-start mt-4 md:ml-6 md:mt-0">
          <h2 className="text-2xl font-bold">Results</h2>
          <ul className="pb-4">
            {state.classification.predictions.map(
              ({ className, probability }, index: number) => (
                <li key={index}>
                  {prettyPrintClassName(className)}:{' '}
                  {prettyPrintPercentage(probability)}
                </li>
              )
            )}
          </ul>
          <p className="text-sm" aria-labelledby="background-info">
            {state.classification.background}
          </p>
        </section>
      ) : (
        <ProgressBar />
      )}
      {state.state === ImageAnalysisStates.ERROR && (
        <p aria-labelledby="prediction-info">
          An error occurred: {state.message}
        </p>
      )}
    </section>
  )
}

const ProgressBar = () => (
  <div className="flex justify-center w-full mt-8">
    <progress></progress>
  </div>
)

const prettyPrintClassName = (className: string) =>
  className
    .split(' ')
    .map((word) => capitalizeWord(word))
    .join(' ')

const capitalizeWord = (word: string): string =>
  word.length <= 2 ? word : `${word[0].toUpperCase()}${word.substring(1)}`

const prettyPrintPercentage = (probability: number) =>
  `${(probability * 100).toFixed(0)}%`
