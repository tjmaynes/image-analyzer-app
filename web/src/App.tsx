import React, { useReducer, useEffect, useCallback } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { BeatLoader } from 'react-spinners'
import {
  GitHubRibbonLink,
  ImageUploader,
  MemoizedImageAnalyzer,
} from './components'
import './App.css'
const loadModel = async () => await mobilenet.load()

const App = () => {
  const [{ isLoadingModel, model, images }, dispatch] = useReducer(reducer, {
    isLoadingModel: true,
    model: null,
    images: [],
  })

  useEffect(() => {
    if (!model) {
      loadModel().then((model) => {
        dispatch({ type: Action.ReadyToUploadImages, model: model })
      })
    }
  }, [model])

  const processFiles = useCallback(
    (images: Blob[]) => {
      dispatch({
        type: Action.ReadyForAnalysis,
        images: images,
      })
    },
    [images]
  )

  return (
    <>
      <GitHubRibbonLink project="tjmaynes/image-analyzer-app" />
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
        {!isLoadingModel && images.length <= 0 && (
          <ImageUploader onUpload={processFiles} />
        )}
        {model && images.length > 0 && (
          <>
            {images.map((data, index) => (
              <MemoizedImageAnalyzer
                key={index}
                imageFile={data}
                model={model}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default App

enum Action {
  LoadingModel = 'Loading model',
  ReadyToUploadImages = 'Ready to upload images',
  ReadyForAnalysis = 'Ready to analyze images',
  Reset = 'Reset app state',
}

type AppAction =
  | { type: Action.LoadingModel }
  | { type: Action.ReadyToUploadImages; model: mobilenet.MobileNet }
  | { type: Action.ReadyForAnalysis; images: Blob[] }
  | { type: Action.Reset }

type AppState = {
  isLoadingModel: boolean
  model: mobilenet.MobileNet | null
  images: Blob[]
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
    case Action.ReadyToUploadImages:
      return {
        ...state,
        isLoadingModel: false,
        model: action.model,
      }
    case Action.ReadyForAnalysis:
      return {
        ...state,
        isLoadingModel: false,
        images: action.images,
      }
    default:
      return state
  }
}
