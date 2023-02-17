import React, { useState, useRef, ChangeEvent, useCallback } from 'react'
import { ErrorContainer } from './ErrorContainer'

const imageMimeType = /image\/(png|jpg|jpeg|webp)/i

enum ImageUploaderError {
  InvalidFileType = 'Invalid file type',
}

export type ImageUploaderProps = {
  onUpload: (images: Blob[]) => void
}

export const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadError, setUploadError] = useState<ImageUploaderError | null>(
    null
  )
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = useCallback((rawImageFiles: FileList) => {
    const blobs: Blob[] = []
    for (let i = 0; i < rawImageFiles.length; i++) {
      if (!rawImageFiles[i].type.match(imageMimeType)) {
        setUploadError(ImageUploaderError.InvalidFileType)
        return
      }
      blobs.push(rawImageFiles[i])
    }

    onUpload(blobs)
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    setIsLoading(true)

    if (e.target.files && e.target.files[0]) handleFiles(e.target.files)
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <article className="image-uploader">
      <form id="form-file-upload" onSubmit={(e) => e.preventDefault()}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
        />
        <label id="label-file-upload" htmlFor="input-file-upload">
          <button
            aria-busy={isLoading ? 'true' : 'false'}
            className="upload-button"
            onClick={onButtonClick}
          >
            Tap to analyze images
          </button>
        </label>
      </form>
      {uploadError && uploadError === ImageUploaderError.InvalidFileType && (
        <ErrorContainer
          errors={['Unable to upload non-png|jpg|jpeg|webp file.']}
        />
      )}
    </article>
  )
}
