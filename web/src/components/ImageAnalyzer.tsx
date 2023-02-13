import React, { useReducer, useCallback, memo } from 'react'
import { ImageCanvas } from './ImageCanvas'
import { ImageAnalysisContainer } from './ImageAnalysisContainer'
import { useClientContext } from '../ClientContext'
import { ImageClassificationData, ImageMetadata } from '../types'
import { RefreshButton } from './RefreshButton'

type ImageAnalyzerProps = { image: Blob }

export const ImageAnalyzer = ({ image }: ImageAnalyzerProps) => {
  const { imageAnalyzerClient } = useClientContext()

  const [{ isLoadingImage, data, error }, dispatch] = useReducer(reducer, {
    isLoadingImage: true,
    data: null,
    error: null,
  })

  const handleImageCanvasRender = useCallback(
    (data: ImageMetadata) => {
      imageAnalyzerClient
        ?.analyze(data)
        .then((result) => {
          if (result.ok)
            dispatch({
              type: Action.ClassifiedImage,
              data: result.val,
            })
          else
            dispatch({
              type: Action.FailedProcessingImage,
              error: result.val,
            })
        })
        .catch((e) => {
          dispatch({
            type: Action.FailedProcessingImage,
            error: e,
          })
        })
    },
    [image, imageAnalyzerClient]
  )

  return (
    <>
      {!isLoadingImage && !error && data && (
        <ImageAnalysisContainer data={data} />
      )}
      <ImageCanvas image={image} onRender={handleImageCanvasRender} />
    </>
  )
}

const MemoizedImageAnalyzer = memo((props: ImageAnalyzerProps) => (
  <ImageAnalyzer {...props} />
))

export const MultiImageAnalyzer = ({ images }: { images: Blob[] }) => (
  <>
    <RefreshButton />
    <section className="image-analyzer-container">
      {images.map((data, index) => (
        <MemoizedImageAnalyzer key={index} image={data} />
      ))}
    </section>
  </>
)

enum Action {
  ProcessingImage = 'Processing image',
  ClassifiedImage = 'Classified image',
  FailedProcessingImage = 'Failed processing image',
}

type AnalyzerAction =
  | { type: Action.ProcessingImage; image: ImageMetadata }
  | {
      type: Action.ClassifiedImage
      data: ImageClassificationData
    }
  | {
      type: Action.FailedProcessingImage
      error: Error
    }

type AnalyzerState = {
  isLoadingImage: boolean
  data: ImageClassificationData | null
  error: Error | null
}

const reducer = (
  state: AnalyzerState,
  action: AnalyzerAction
): AnalyzerState => {
  switch (action.type) {
    case Action.ProcessingImage:
      return {
        ...state,
        isLoadingImage: true,
      }
    case Action.ClassifiedImage:
      return {
        ...state,
        isLoadingImage: false,
        data: action.data,
      }
    case Action.FailedProcessingImage:
      return {
        ...state,
        isLoadingImage: false,
        error: action.error,
      }
    default:
      return state
  }
}
