import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import routesConfig from './routes'
import { queryClient } from './queries'
import { appDependenciesLoader } from './loaders'
import './style.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App
      routes={routesConfig(appDependenciesLoader(queryClient))}
      queryClient={queryClient}
    />
  </React.StrictMode>
)
