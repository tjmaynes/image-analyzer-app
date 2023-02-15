import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HomePage, UploadPage, NotFoundPage } from './pages'
import { LoadingSpinner, Wrapper } from './components'
import { queryClient } from './queries'
import { imageAnalyzerClientLoader } from './loaders'

const App = () => (
  <Wrapper>
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={createBrowserRouter([
          {
            element: <HomePage />,
            path: '/',
            loader: imageAnalyzerClientLoader(queryClient),
          },
          {
            path: '/upload',
            element: <UploadPage />,
            loader: imageAnalyzerClientLoader(queryClient),
          },
          {
            element: <NotFoundPage />,
            path: '*',
          },
        ])}
        fallbackElement={<LoadingSpinner isLoading />}
      />
    </QueryClientProvider>
  </Wrapper>
)

export default App
