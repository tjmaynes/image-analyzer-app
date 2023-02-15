import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ImageAnalyzer, LoadingSpinner } from '../components'
import { loadImageQuery } from '../queries'

export const HomePage = () => {
  const { data, isLoading } = useQuery(loadImageQuery('/images/sample.jpg'))

  return (
    <div className="home">
      {isLoading && <LoadingSpinner isLoading={isLoading} />}
      {data && <ImageAnalyzer ImageUploadInfo={data} />}
      <Link to="/upload">Try it out?</Link>
    </div>
  )
}
