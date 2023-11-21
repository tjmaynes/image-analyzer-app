import React from 'react'
import { Outlet, RouteObject } from 'react-router'
import { Wrapper } from './components'
import { HomePage, NotFoundPage } from './pages'
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
    ],
  },
  {
    element: <NotFoundPage />,
    path: '*',
  },
]

export default routesConfig
