import React from 'react'
import {
  RouterProvider,
  createBrowserRouter,
  RouteObject,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoadingPage } from './pages'

type AppProps = { routes: RouteObject[]; queryClient: QueryClient }

const App = ({ routes, queryClient }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider
      router={createBrowserRouter(routes)}
      fallbackElement={<LoadingPage />}
    />
  </QueryClientProvider>
)

export default App
