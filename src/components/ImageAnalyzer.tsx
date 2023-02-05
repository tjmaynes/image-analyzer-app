import React, { useCallback, useReducer } from 'react'
import { MobileNet } from '@tensorflow-models/mobilenet'
import { BeatLoader } from 'react-spinners'
import { Result } from 'ts-results'
import {
  MemoizedImageDetails,
  ImageUploader,
  ErrorContainer,
} from '../components'
import { ImageClassificationData } from '../types'

type ImageAnalyzerProps = {
  imageClassifier: (
    imageFile: Blob,
    model: MobileNet
  ) => Promise<Result<ImageClassificationData, Error>>
  model: MobileNet
}

export const ImageAnalyzer = ({
  imageClassifier,
  model,
}: ImageAnalyzerProps) => {
  const [{ imageQueue, data, errors }, dispatch] = useReducer(reducer, {
    imageQueue: [],
    data: [],
    errors: [],
  })

  const processFiles = useCallback(
    (files: Blob[]) => {
      if (model) {
        dispatch({
          type: Action.ProcessingFiles,
          images: files,
        })

        files.forEach((file) => {
          imageClassifier(file, model)
            .then((result) => {
              if (result.ok) {
                dispatch({
                  type: Action.ProcessedImage,
                  data: result.val,
                })
              }
            })
            .catch((error) => {
              dispatch({
                type: Action.FailedProcessingImage,
                id: file.name,
                error: error,
              })
            })
        })
      }
    },
    [data, imageQueue, errors, model]
  )

  return (
    <div className="container">
      {data.length <= 0 && errors.length <= 0 && imageQueue.length <= 0 && (
        <ImageUploader onUpload={processFiles} />
      )}
      {imageQueue.length > 0 && (
        <>
          {imageQueue.map(({ name }, index) => {
            return (
              <div key={index}>
                <h1 className="processing-message">
                  Processing image: '{name}'
                </h1>
                <BeatLoader
                  color="#189a92"
                  loading={imageQueue.length > 0}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            )
          })}
        </>
      )}
      {data.length > 0 && errors.length <= 0 && (
        <>
          {data.map((data, index) => (
            <MemoizedImageDetails key={index} {...data} />
          ))}
        </>
      )}
      {errors.length > 0 && (
        <ErrorContainer errors={errors.map((error) => error.message)} />
      )}
    </div>
  )
}

enum Action {
  ProcessingFiles = 'Processing files',
  ProcessedImage = 'Processed image',
  FailedProcessingImage = 'Failed processing image',
}

type AppAction =
  | { type: Action.ProcessingFiles; images: Blob[] }
  | {
      type: Action.ProcessedImage
      data: ImageClassificationData
    }
  | {
      type: Action.FailedProcessingImage
      id: string
      error: Error
    }

type AppState = {
  imageQueue: Blob[]
  data: ImageClassificationData[]
  errors: Error[]
}

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case Action.ProcessingFiles:
      return {
        ...state,
        imageQueue: action.images,
      }
    case Action.ProcessedImage:
      return {
        ...state,
        imageQueue: state.imageQueue.filter(
          (image) => image.name !== action.data.name
        ),
        data: [...state.data, action.data],
        errors: state.errors,
      }
    case Action.FailedProcessingImage:
      return {
        ...state,
        imageQueue: state.imageQueue.filter(
          (image) => image.name !== action.id
        ),
        errors: [...state.errors, action.error],
      }
    default:
      return state
  }
}
