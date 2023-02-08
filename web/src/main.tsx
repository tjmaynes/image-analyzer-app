import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClientContext, createClientContext } from './ClientContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ClientContext.Provider value={createClientContext()}>
      <App />
    </ClientContext.Provider>
  </React.StrictMode>
)
