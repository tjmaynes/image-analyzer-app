import React, { useCallback, useState } from 'react'
import { ImageUploader, MultiImageAnalyzer } from '../components'

export const NewImageAnalysisPage = () => {
  const [images, setImages] = useState<Blob[]>([])

  const processFiles = useCallback(
    (images: Blob[]) => {
      setImages(images)
    },
    [images, setImages]
  )

  return (
    <>
      {images.length <= 0 && <ImageUploader onUpload={processFiles} />}
      {images.length > 0 && <MultiImageAnalyzer images={images} />}
    </>
  )
}

enum Action {
  LoadingModel = 'Loading model',
  ReadyForAnalysis = 'Ready to analyze images',
  Reset = 'Reset app state',
}

type AppAction =
  | { type: Action.LoadingModel }
  | { type: Action.ReadyForAnalysis; images: Blob[] }
  | { type: Action.Reset }

type AppState = {
  images: Blob[]
}

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case Action.ReadyForAnalysis:
      return {
        ...state,
        images: action.images,
      }
    default:
      return state
  }
}
