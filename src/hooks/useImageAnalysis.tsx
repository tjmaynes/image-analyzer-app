import { useCallback, useEffect, useReducer } from 'react'
import {
  ImageClassificationData,
  ImageMetadata,
  ImageUploadInfo,
} from '../types'
import { classifyImage } from '../lib/image'

enum ImageAnalysisActions {
  ON_RENDER,
  ON_FINISH,
  ON_ERROR,
}

type ImageAnalysisAction =
  | {
      action: ImageAnalysisActions.ON_RENDER
      imageMetadata: ImageMetadata
    }
  | {
      action: ImageAnalysisActions.ON_FINISH
      classification: ImageClassificationData
    }
  | {
      action: ImageAnalysisActions.ON_ERROR
      message: string
    }

export enum ImageAnalysisStates {
  INITIAL,
  ANALYZING,
  FINISHED,
  ERROR,
}

type ImageAnalysisState =
  | {
      state: ImageAnalysisStates.INITIAL
      imageUploadInfo: ImageUploadInfo
    }
  | {
      state: ImageAnalysisStates.ANALYZING
      imageMetadata: ImageMetadata
    }
  | {
      state: ImageAnalysisStates.FINISHED
      classification: ImageClassificationData
    }
  | {
      state: ImageAnalysisStates.ERROR
      message: string
    }

export const useImageAnalysis = (imageUploadInfo: ImageUploadInfo) => {
  const [state, dispatch] = useReducer(imageAnalysisReducer, {
    state: ImageAnalysisStates.INITIAL,
    imageUploadInfo,
  })

  useEffect(() => {
    if (state.state === ImageAnalysisStates.ANALYZING) {
      classifyImage(state.imageMetadata)
        .then((classification) => {
          dispatch({
            action: ImageAnalysisActions.ON_FINISH,
            classification,
          })
        })
        .catch((error) =>
          dispatch({
            action: ImageAnalysisActions.ON_ERROR,
            message: error.message,
          })
        )
    }
  }, [state])

  const onImageRenderCallback = useCallback(
    (imageData: ImageData) => {
      dispatch({
        action: ImageAnalysisActions.ON_RENDER,
        imageMetadata: { ...imageUploadInfo, imageData },
      })
    },
    [dispatch, imageUploadInfo]
  )

  return { state, onImageRenderCallback }
}

export const imageAnalysisReducer = (
  _: ImageAnalysisState,
  action: ImageAnalysisAction
): ImageAnalysisState => {
  switch (action.action) {
    case ImageAnalysisActions.ON_RENDER:
      return {
        state: ImageAnalysisStates.ANALYZING,
        imageMetadata: action.imageMetadata,
      }
    case ImageAnalysisActions.ON_FINISH:
      return {
        state: ImageAnalysisStates.FINISHED,
        classification: action.classification,
      }
    case ImageAnalysisActions.ON_ERROR:
      return {
        state: ImageAnalysisStates.ERROR,
        message: action.message,
      }
  }
}
