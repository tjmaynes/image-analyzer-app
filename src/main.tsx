import React from 'react'
import ReactDOM from 'react-dom/client'
import { readAndClassifyImageBuilder } from './image-classification'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App
      imageClassifier={readAndClassifyImageBuilder(
        import.meta.env.VITE_API_HOST || ''
      )}
    />
  </React.StrictMode>
)
