import React, { useCallback, useReducer } from 'react'
import { BeatLoader } from 'react-spinners'
import { useClientContext } from '../ClientContext'
import {
  MemoizedImageDetails,
  ImageUploader,
  ErrorContainer,
} from '../components'
import { ImageClassificationData, ImageMetadata } from '../types'

export const ImageAnalyzer = () => {
  const { imageAnalyzerClient } = useClientContext()

  const [{ imageQueue, data, errors }, dispatch] = useReducer(reducer, {
    imageQueue: [],
    data: [],
    errors: [],
  })

  const processFiles = useCallback(
    (images: ImageMetadata[]) => {
      dispatch({
        type: Action.ProcessingFiles,
        images: images,
      })

      images.forEach((file) => {
        imageAnalyzerClient
          .analyze(file)
          .then((result) => {
            if (result.ok)
              dispatch({
                type: Action.ClassifiedImage,
                data: result.val,
              })
            else
              dispatch({
                type: Action.FailedProcessingImage,
                id: file.name,
                error: result.val,
              })
          })
          .catch((e) => {
            dispatch({
              type: Action.FailedProcessingImage,
              id: file.name,
              error: e,
            })
          })
      })
    },
    [data, imageQueue, errors]
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
  ClassifiedImage = 'Classified image',
  FailedProcessingImage = 'Failed processing image',
}

type AppAction =
  | { type: Action.ProcessingFiles; images: ImageMetadata[] }
  | {
      type: Action.ClassifiedImage
      data: ImageClassificationData
    }
  | {
      type: Action.FailedProcessingImage
      id: string
      error: Error
    }

type AppState = {
  imageQueue: ImageMetadata[]
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
    case Action.ClassifiedImage:
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
