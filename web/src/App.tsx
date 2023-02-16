import React from 'react'
import {
  RouterProvider,
  createBrowserRouter,
  RouteObject,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoadingSpinner } from './components'

type AppProps = { routes: RouteObject[]; queryClient: QueryClient }

const App = ({ routes, queryClient }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider
      router={createBrowserRouter(routes)}
      fallbackElement={<LoadingSpinner isLoading />}
    />
  </QueryClientProvider>
)

export default App
