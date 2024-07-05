import { useState, useRef, ChangeEvent, useCallback } from 'react'
import { ErrorContainer } from './ErrorContainer'
import { ImageUploadInfo } from '../types'

const imageMimeType = /image\/(png|jpg|jpeg|webp)/i

enum ImageUploaderError {
  InvalidFileType = 'Invalid file type',
}

type ImageUploaderProps = {
  onUpload: (images: ImageUploadInfo[]) => void
}

export const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
  const [uploadError, setUploadError] = useState<ImageUploaderError | null>(
    null
  )
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = useCallback(
    (rawImageFiles: FileList) => {
      const images: ImageUploadInfo[] = []
      for (let i = 0; i < rawImageFiles.length; i++) {
        if (!rawImageFiles[i].type.match(imageMimeType)) {
          setUploadError(ImageUploaderError.InvalidFileType)
          return
        }
        images.push({
          imageId: rawImageFiles[i].name,
          imageBlob: rawImageFiles[i],
        })
      }

      onUpload(images)
    },
    [onUpload]
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) handleFiles(e.target.files)
  }

  return (
    <>
      <form
        className="flex justify-center py-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          id="image-upload"
          name="image-upload"
          multiple={true}
          onChange={(e) => handleChange(e)}
        />
      </form>
      {uploadError && uploadError === ImageUploaderError.InvalidFileType && (
        <ErrorContainer
          errors={['Unable to upload non-png|jpg|jpeg|webp file.']}
        />
      )}
    </>
  )
}
