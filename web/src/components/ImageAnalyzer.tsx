import { MobileNet } from '@tensorflow-models/mobilenet'
import React, { useReducer, useCallback } from 'react'
import { memo } from 'react'
import { useClientContext } from '../ClientContext'
import { ImageClassificationData, ImageMetadata } from '../types'
import { ImageCanvas } from './ImageCanvas'
import { ImageAnalysisContainer } from './ImageAnalysisContainer'

type ImageAnalyzerProps = { imageFile: Blob; model: MobileNet }

const ImageAnalyzer = ({ imageFile, model }: ImageAnalyzerProps) => {
  const { imageAnalyzerClient } = useClientContext()

  const [{ isLoadingImage, data, error }, dispatch] = useReducer(reducer, {
    isLoadingImage: true,
    data: null,
    error: null,
  })

  const handleImageCanvasRender = useCallback(
    (data: ImageMetadata) => {
      imageAnalyzerClient
        .analyze(data, model)
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
    [imageFile, imageAnalyzerClient]
  )

  return (
    <>
      {!isLoadingImage && !error && data && (
        <ImageAnalysisContainer data={data} />
      )}
      <ImageCanvas imageFile={imageFile} onRender={handleImageCanvasRender} />
    </>
  )
}

export const MemoizedImageAnalyzer = memo((props: ImageAnalyzerProps) => (
  <ImageAnalyzer {...props} />
))

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
