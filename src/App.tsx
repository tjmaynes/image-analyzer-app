import React, { useEffect, useReducer } from 'react'
import { MobileNet } from '@tensorflow-models/mobilenet'
import { BeatLoader } from 'react-spinners'
import { Result } from 'ts-results'
import { ImageAnalyzer } from './components'
import { loadModel } from './image-classification'
import { ImageClassificationData } from './types'
import './App.css'

type AppProps = {
  imageClassifier: (
    imageFile: Blob,
    model: MobileNet
  ) => Promise<Result<ImageClassificationData, Error>>
}

const App = ({ imageClassifier }: AppProps) => {
  const [{ isLoadingModel, model }, dispatch] = useReducer(reducer, {
    isLoadingModel: true,
    model: null,
  })

  useEffect(() => {
    if (!model) {
      loadModel().then((model) => {
        dispatch({ type: Action.ReadyForAnalysis, model: model })
      })
    }
  }, [model])

  return (
    <div className="container">
      {isLoadingModel && (
        <div>
          <h1 className="processing-message">Loading model...</h1>
          <BeatLoader
            color="#189a92"
            loading={isLoadingModel}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      {!isLoadingModel && model && (
        <ImageAnalyzer imageClassifier={imageClassifier} model={model} />
      )}
    </div>
  )
}

export default App

enum Action {
  LoadingModel = 'Loading model',
  ReadyForAnalysis = 'Ready to analyze images',
  Reset = 'Reset app state',
}

type AppAction =
  | { type: Action.LoadingModel }
  | { type: Action.ReadyForAnalysis; model: MobileNet }
  | { type: Action.Reset }

type AppState = {
  isLoadingModel: boolean
  model: MobileNet | null
}

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case Action.Reset:
      return {
        ...state,
        isLoadingModel: false,
      }
    case Action.LoadingModel:
      return {
        ...state,
        isLoadingModel: true,
      }
    case Action.ReadyForAnalysis:
      return {
        ...state,
        isLoadingModel: false,
        model: action.model,
      }
    default:
      return state
  }
}
