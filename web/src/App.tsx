import React, { ReactNode, useEffect, useReducer } from 'react'
import { Link } from 'react-router-dom'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { LoadingSpinner } from './components'
import AppRouter from './AppRouter'
import './App.scss'

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="wrapper">
      <header>
        <h1>
          <Link to="/">Image Analyzer</Link>
        </h1>
      </header>
      <div className="content">{children}</div>
    </div>
  )
}

const App = () => {
  const [{ isLoadingModel, model }, dispatch] = useReducer(reducer, {
    isLoadingModel: true,
    model: null,
  })

  useEffect(() => {
    if (!model) {
      mobilenet.load().then((model) => {
        dispatch({ type: Action.ReadyToUploadImages, model: model })
      })
    }
  }, [model])

  return (
    <Wrapper>
      {isLoadingModel && (
        <LoadingSpinner
          processingText="Loading model"
          isLoading={isLoadingModel}
        />
      )}
      {!isLoadingModel && model && <AppRouter model={model} />}
    </Wrapper>
  )
}

export default App

enum Action {
  LoadingModel = 'Loading model',
  ReadyToUploadImages = 'Ready to upload images',
}

type AppAction =
  | { type: Action.LoadingModel }
  | { type: Action.ReadyToUploadImages; model: mobilenet.MobileNet }

type AppState = {
  isLoadingModel: boolean
  model: mobilenet.MobileNet | null
}

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
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
    default:
      return state
  }
}
