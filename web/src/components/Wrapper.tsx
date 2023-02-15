import React, { ReactNode } from 'react'

export const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className="wrapper">
    <header>
      <h1>Image Analyzer</h1>
    </header>
    <div className="content">{children}</div>
  </div>
)
