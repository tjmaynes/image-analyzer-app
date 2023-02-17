import React, { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ImageAnalyzer, ImageUploader, MultiImageAnalyzer } from '../components'
import { loadImageQuery } from '../queries'
import { ImageUploadInfo } from '../types'

export const HomePage = () => {
  const [images, setImages] = useState<ImageUploadInfo[]>([])

  const processFiles = useCallback(
    (images: Blob[]) => {
      setImages(
        images.map((imageBlob) => ({
          id: imageBlob.name,
          imageBlob,
        }))
      )
    },
    [images, setImages]
  )

  if (images.length <= 0)
    return (
      <section>
        <Welcome onUpload={processFiles} />
        <SampleImagePreview imageSource="/images/sample.jpg" />
      </section>
    )

  return (
    <section>
      <MultiImageAnalyzer images={images} />
    </section>
  )
}

const Welcome = ({ onUpload }: { onUpload: (images: Blob[]) => void }) => (
  <section className="grid">
    <hgroup>
      <h1>Background</h1>
      <p>
        <strong>Image Analyzer</strong> is a Proof-of-Concept web application
        that analyzes your images using{' '}
        <strong>
          <a href="https://ai.googleblog.com/2017/06/mobilenets-open-source-models-for.html">
            MobileNet
          </a>
        </strong>{' '}
        and{' '}
        <strong>
          <a href="https://chat.openai.com/chat">ChatGPT</a>
        </strong>
        .
      </p>
      <blockquote>
        <strong>Technical Notes: </strong>MobileNet classifies your images in
        the browser using Tensorflow.js. ChatGPT describes your images using a
        GraphQL-based API running on a Cloudflare Worker.
        <footer>
          <cite>
            Ping me at <a href="https://twitter.com/tjmaynes">@tjmaynes</a> for
            any feedback. Enjoy!
          </cite>
        </footer>
      </blockquote>
    </hgroup>
    <ImageUploader onUpload={onUpload} />
  </section>
)

const SampleImagePreview = ({ imageSource }: { imageSource: string }) => {
  const { data, isLoading } = useQuery(loadImageQuery(imageSource))

  if (isLoading) return <progress></progress>
  return data ? (
    <>
      <h1>Sample Analysis</h1>
      <ImageAnalyzer imageUploadInfo={data} />
    </>
  ) : (
    <></>
  )
}
