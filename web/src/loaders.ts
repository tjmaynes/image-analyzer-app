import { QueryClient } from '@tanstack/react-query'
import { appDependenciesQuery } from './queries'
import { IImageAnalyzerClient } from './types'

export const appDependenciesLoader =
  (queryClient: QueryClient) => async (): Promise<IImageAnalyzerClient> =>
    queryClient.ensureQueryData(appDependenciesQuery())
