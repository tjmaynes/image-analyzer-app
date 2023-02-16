import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import routesConfig from './routes'
import { queryClient } from './queries'
import { imageAnalyzerClientLoader } from './loaders'
import './App.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App
      routes={routesConfig(imageAnalyzerClientLoader(queryClient))}
      queryClient={queryClient}
    />
  </React.StrictMode>
)
