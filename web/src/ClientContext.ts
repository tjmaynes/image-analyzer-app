import { createContext, useContext } from 'react'
import { MobileNet } from '@tensorflow-models/mobilenet'
import {
  ImageAnalyzerClient,
  MobileNetImageClassifierClient,
  ApiClient,
} from './clients'
import { IImageAnalyzerClient } from './types'

export type Clients = {
  imageAnalyzerClient: IImageAnalyzerClient | null
}

export const createClientContext = (model?: MobileNet) =>
  model
    ? {
        imageAnalyzerClient: new ImageAnalyzerClient(
          new MobileNetImageClassifierClient(model),
          new ApiClient(
            import.meta.env.VITE_API_HOST || 'http://localhost:8081'
          )
        ),
      }
    : {
        imageAnalyzerClient: null,
      }

export const ClientContext = createContext<Clients>(createClientContext())

export const useClientContext = () => useContext(ClientContext)
