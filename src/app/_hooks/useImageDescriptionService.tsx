'use client'

import { useEffect, useState } from 'react'
import { getImageDescription } from '@/lib/data'

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
      getImageDescription(classification)
        .then(({ message, status }) => {
          if (status === 200) {
            setImageDescriptionState({
              state: 'FINISHED',
              description: message,
            })
          } else {
            console.error(message)
            setImageDescriptionState({
              state: 'ERROR',
              message: message,
            })
          }
        })
        .catch((error: Error) => {
          console.error(error)
          setImageDescriptionState({
            state: 'ERROR',
            message: error.message,
          })
        })
    }
  }, [classification, imageDescriptionState, setImageDescriptionState])

  return { imageDescriptionResult: imageDescriptionState }
}
