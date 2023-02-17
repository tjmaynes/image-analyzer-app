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
        <h2>
          <a href="/" className="primary">
            Image Analyzer
          </a>
        </h2>
      </li>
    </ul>
  </nav>
)

const Footer = () => (
  <nav className="container-fluid">
    <small>
      <strong>Built</strong> with{' '}
      <a href="https://reactjs.org/" className="primary">
        React
      </a>{' '}
      &{' '}
      <a href="https://workers.cloudflare.com/" className="primary">
        Cloudflare Workers
      </a>{' '}
      •{' '}
      <a
        href="https://github.com/tjmaynes/image-analyzer-app"
        className="primary"
      >
        Source code
      </a>
    </small>
  </nav>
)
