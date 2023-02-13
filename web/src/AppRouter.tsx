import React from 'react'
import { MobileNet } from '@tensorflow-models/mobilenet'
import { Route, Routes } from 'react-router'
import { ClientContext, createClientContext } from './ClientContext'
import { HomePage, NewImageAnalysisPage, NotFoundPage } from './pages'

const AppRouter = ({ model }: { model: MobileNet }) => (
  <ClientContext.Provider value={createClientContext(model)}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/new" element={<NewImageAnalysisPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </ClientContext.Provider>
)

export default AppRouter
