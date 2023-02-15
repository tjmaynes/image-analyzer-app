import { Link } from 'react-router-dom'

import React from 'react'

export const NotFoundPage = () => {
  return (
    <div>
      <h1>Oops! You seem to be lost.</h1>
      <p>
        Here are some helpful links, quick head <Link to="/">home</Link>.
      </p>
    </div>
  )
}
