'use client'

import { useEffect, useState } from 'react'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import { load as loadModel, MobileNet } from '@tensorflow-models/mobilenet'
import { Classification } from '@/app/types'

type ImageClassificationState =
  | {
      state: 'FINISHED_LOADING_CLASSIFICATION'
      classification: Classification
    }
  | {
      state: 'FINISHED_LOADING_MODEL'
      model: MobileNet
    }
  | {
      state: 'LOADING_MODEL'
    }
  | {
      state: 'ERROR_LOADING_MODEL'
      message: string
    }
  | {
      state: 'ERROR_LOADING_CLASSIFICATION'
      message: string
    }

let cachedModel: MobileNet | null = null

export const useImageClassificationService = (imageData: ImageData) => {
  const [imageClassificationState, setImageClassificationState] =
    useState<ImageClassificationState>({
      state: 'LOADING_MODEL',
    })

  useEffect(() => {
    if (imageClassificationState.state === 'LOADING_MODEL') {
      if (cachedModel) {
        setImageClassificationState({
          state: 'FINISHED_LOADING_MODEL',
          model: cachedModel,
        })
      } else {
        loadModel()
          .then((model) => {
            cachedModel = model

            setImageClassificationState({
              state: 'FINISHED_LOADING_MODEL',
              model,
            })
          })
          .catch((error) => {
            console.error(error)

            setImageClassificationState({
              state: 'ERROR_LOADING_MODEL',
              message: error.getMessage(),
            })
          })
      }
    } else if (imageClassificationState.state === 'FINISHED_LOADING_MODEL') {
      imageClassificationState.model
        .classify(imageData)
        .then((result) => {
          const sortedPredictions = Array.from(result)
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 5)

          const topClassification = sortedPredictions[0].className

          setImageClassificationState({
            state: 'FINISHED_LOADING_CLASSIFICATION',
            classification: {
              top: topClassification,
              predictions: sortedPredictions,
            },
          })
        })
        .catch((error: Error) => {
          console.error(error)

          setImageClassificationState({
            state: 'ERROR_LOADING_CLASSIFICATION',
            message: error.message,
          })
        })
    }
  }, [imageData, imageClassificationState, setImageClassificationState])

  return { imageClassificationResult: imageClassificationState }
}
