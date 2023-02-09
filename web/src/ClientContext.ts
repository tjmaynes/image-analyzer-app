import { createContext, useContext } from 'react'
import {
  ImageAnalyzerClient,
  MobileNetImageClassifierClient,
  ApiClient,
} from './clients'
import { IImageAnalyzerClient } from './types'

export type Clients = {
  imageAnalyzerClient: IImageAnalyzerClient
}

export const createClientContext = () => ({
  imageAnalyzerClient: new ImageAnalyzerClient(
    new MobileNetImageClassifierClient(),
    new ApiClient(import.meta.env.VITE_API_HOST || 'http://localhost:8081')
  ),
})

export const ClientContext = createContext<Clients>(createClientContext())

export const useClientContext = () => useContext(ClientContext)
