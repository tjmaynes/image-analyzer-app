import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageAnalyzer } from '../components'

export const HomePage = () => {
  const [imageFile, setImageFile] = useState<Blob | null>(null)

  useEffect(() => {
    if (!imageFile) {
      fetch('/images/sample.jpg')
        .then((response) => response.blob())
        .then((imageBlob) => setImageFile(imageBlob))
    }
  }, [imageFile, setImageFile])

  return (
    <div>
      {imageFile && <ImageAnalyzer image={imageFile} />}
      <Link to="/new">Try it out?</Link>
    </div>
  )
}
