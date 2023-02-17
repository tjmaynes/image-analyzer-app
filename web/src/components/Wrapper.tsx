import React, { ReactNode } from 'react'

export const Wrapper = ({ children }: { children: ReactNode }) => (
  <>
    <Header />
    <main className="container">{children}</main>
    <Footer />
  </>
)

const Header = () => (
  <nav className="container-fluid">
    <ul>
      <li>
        <h1>Image Analyzer</h1>
      </li>
    </ul>
  </nav>
)

const Footer = () => (
  <nav className="container-fluid">
    <small>
      <strong>Built</strong> with{' '}
      <a href="https://reactjs.org/" className="secondary">
        React
      </a>{' '}
      &{' '}
      <a href="https://workers.cloudflare.com/" className="secondary">
        Cloudflare Workers
      </a>{' '}
      •{' '}
      <a
        href="https://github.com/tjmaynes/image-analyzer-app"
        className="secondary"
      >
        Source code
      </a>
    </small>
  </nav>
)
