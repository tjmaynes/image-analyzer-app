import React, {
  useState,
  useRef,
  DragEvent,
  ChangeEvent,
  useEffect,
  useMemo,
} from 'react'
import { ImageMetadata, ImageProcessingResults } from '../types'
import { ErrorContainer } from './ErrorContainer'

const imageMimeType = /image\/(png|jpg|jpeg)/i

enum ImageUploaderError {
  InvalidFileType = 'Invalid file type',
}

export type ImageUploaderProps = {
  onUpload: (images: ImageMetadata[]) => void
}

export const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<ImageUploaderError | null>(
    null
  )
  const [rawImageFiles, setRawImageFiles] = useState<FileList | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const readImages: Worker = useMemo(
    () =>
      new Worker(new URL('./workers/image-reader.ts', import.meta.url), {
        type: 'module',
      }),
    []
  )

  const handleFiles = (rawImageFiles: FileList) => {
    for (let i = 0; i < rawImageFiles.length; i++) {
      if (!rawImageFiles[i].type.match(imageMimeType)) {
        setUploadError(ImageUploaderError.InvalidFileType)
        return
      }
    }

    setRawImageFiles(rawImageFiles)
  }

  const handleDrag = (
    e: DragEvent<HTMLDivElement> | DragEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (
    e: DragEvent<HTMLDivElement> | DragEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) handleFiles(e.target.files)
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  useEffect(() => {
    if (window.Worker && rawImageFiles && rawImageFiles.length > 0)
      readImages.postMessage(rawImageFiles)
  }, [rawImageFiles])

  useEffect(() => {
    if (window.Worker) {
      readImages.onmessage = (e: MessageEvent<ImageProcessingResults>) => {
        onUpload(e.data.data)
      }
    }
  }, [readImages])

  return (
    <form
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
      />
      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? 'drag-active' : ''}
      >
        <div>
          <p>Drag a Photo Here to Upload</p>
          <p>
            or{' '}
            <button className="upload-button" onClick={onButtonClick}>
              Upload an image
            </button>
          </p>
          {uploadError &&
            uploadError === ImageUploaderError.InvalidFileType && (
              <ErrorContainer
                errors={['Unable to upload non-png|jpg|jpeg file.']}
              />
            )}
        </div>
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  )
}
