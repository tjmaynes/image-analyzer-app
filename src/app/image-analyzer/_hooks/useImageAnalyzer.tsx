'use client'

import { useEffect, useState } from 'react'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import { load as loadModel, MobileNet } from '@tensorflow-models/mobilenet'
import { Prediction } from '@/app/image-analyzer/types'
import { getImageDescription } from '@/lib/image'

type ImageAnalyzerState =
  | {
      state: 'FINISHED'
      classification: string
      description: string
      predictions: Prediction[]
    }
  | {
      state: 'FINISHED_PREDICTIONS'
      predictions: Prediction[]
    }
  | {
      state: 'FINISHED_LOADING_MODEL'
      model: MobileNet
    }
  | {
      state: 'LOADING_MODEL'
    }
  | {
      state: 'ERROR'
      message: string
    }

let cachedModel: MobileNet | null = null

export const useImageAnalyzer = (imageData: ImageData) => {
  const [imageAnalyzerState, setImageAnalyzerState] =
    useState<ImageAnalyzerState>({
      state: 'LOADING_MODEL',
    })

  useEffect(() => {
    if (imageAnalyzerState.state === 'LOADING_MODEL') {
      if (cachedModel) {
        setImageAnalyzerState({
          state: 'FINISHED_LOADING_MODEL',
          model: cachedModel,
        })
      } else {
        loadModel()
          .then((model) => {
            cachedModel = model

            setImageAnalyzerState({
              state: 'FINISHED_LOADING_MODEL',
              model,
            })
          })
          .catch((error) => {
            console.error(error)
            setImageAnalyzerState({
              state: 'ERROR',
              message: error.getMessage(),
            })
          })
      }
    } else if (imageAnalyzerState.state === 'ERROR') {
      setImageAnalyzerState({
        state: 'ERROR',
        message: imageAnalyzerState.message,
      })
    } else if (imageAnalyzerState.state === 'FINISHED_LOADING_MODEL') {
      imageAnalyzerState.model.classify(imageData).then((predictions) => {
        setImageAnalyzerState({
          state: 'FINISHED_PREDICTIONS',
          predictions,
        })
      })
    } else if (imageAnalyzerState.state === 'FINISHED_PREDICTIONS') {
      const sortedPredictions = Array.from(imageAnalyzerState.predictions)
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 5)

      const topClassification = sortedPredictions[0].className

      getImageDescription(topClassification).then(({ description }) => {
        setImageAnalyzerState({
          state: 'FINISHED',
          predictions: imageAnalyzerState.predictions,
          description: description,
          classification: topClassification,
        })
      })
    }
  }, [imageData, imageAnalyzerState, setImageAnalyzerState])

  return { imageClassifier: imageAnalyzerState }
}
