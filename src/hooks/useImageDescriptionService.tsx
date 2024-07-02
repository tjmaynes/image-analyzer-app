import { useEffect, useState } from 'react'
import db from '../data/db.json'

type ImageDescriptionState =
  | {
      state: 'LOADING'
    }
  | {
      state: 'FINISHED'
      description: string
    }
  | {
      state: 'ERROR'
      message: string
    }

export const useImageDescriptionService = (classification: string) => {
  const [imageDescriptionState, setImageDescriptionState] =
    useState<ImageDescriptionState>({
      state: 'LOADING',
    })

  useEffect(() => {
    if (imageDescriptionState.state === 'LOADING') {
      const found = db.data.find(({ name }) => name === classification)
      if (found) {
        setImageDescriptionState({
          state: 'FINISHED',
          description: found.description,
        })
      } else {
        setImageDescriptionState({
          state: 'ERROR',
          message: `Unable to find description for classification: '${classification}'`,
        })
      }
    }
  }, [classification, imageDescriptionState, setImageDescriptionState])

  return { imageDescriptionResult: imageDescriptionState }
}
