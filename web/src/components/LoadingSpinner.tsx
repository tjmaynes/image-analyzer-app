import React from 'react'
import { BeatLoader } from 'react-spinners'

type LoadingSpinnerProps = {
  processingText?: string
  isLoading: boolean
}

export const LoadingSpinner = ({
  processingText,
  isLoading,
}: LoadingSpinnerProps) => (
  <div>
    {processingText && <h1 className="processing-message">{processingText}</h1>}
    <BeatLoader
      color="#189a92"
      loading={isLoading}
      size={20}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>
)
