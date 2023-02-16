import React from 'react'
import { Outlet, RouteObject } from 'react-router'
import { Wrapper } from './components'
import { HomePage, NotFoundPage, UploadPage } from './pages'
import { IImageAnalyzerClient } from './types'

const routesConfig = (
  clientLoader: () => Promise<IImageAnalyzerClient>
): RouteObject[] => [
  {
    path: '/',
    element: (
      <Wrapper>
        <Outlet />
      </Wrapper>
    ),
    errorElement: <NotFoundPage />,
    loader: clientLoader,
    children: [
      {
        element: <HomePage />,
        path: '/',
      },
      {
        path: '/upload',
        element: <UploadPage />,
      },
      {
        element: <NotFoundPage />,
        path: '*',
      },
    ],
  },
]

export default routesConfig
