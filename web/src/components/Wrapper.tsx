import React, { ReactNode } from 'react'

export const Wrapper = ({ children }: { children: ReactNode }) => (
  <>
    <Header />
    <main className="container">
      <Welcome />
      {children}
    </main>
    <Footer />
  </>
)

const Header = () => (
  <header>
    <nav className="container-fluid">
      <ul>
        <li>
          <h2>Image Analyzer</h2>
        </li>
      </ul>
    </nav>
  </header>
)

const Welcome = () => (
  <div>
    <h1>Background</h1>
    <p>
      <strong>Image Analyzer</strong> is a proof-of-concept web application that
      analyzes your images using{' '}
      <strong>
        <a href="https://ai.googleblog.com/2017/06/mobilenets-open-source-models-for.html">
          MobileNet
        </a>
      </strong>{' '}
      and{' '}
      <strong>
        <a href="https://chat.openai.com/chat">ChatGPT</a>
      </strong>
      . <strong>Warning</strong>: Proof-of-concept tool is not super accurate,
      your results may vary.
    </p>
    <blockquote>
      <strong>Technical Notes: </strong>MobileNet classifies your images in the
      browser using Tensorflow.js. ChatGPT describes your images using a
      GraphQL-based API running on a Cloudflare Worker.
      <footer>
        <cite>
          Ping me at <a href="https://twitter.com/tjmaynes">@tjmaynes</a> for
          any feedback. Enjoy!
        </cite>
      </footer>
    </blockquote>
  </div>
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
