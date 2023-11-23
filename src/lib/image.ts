export const resizeImage = ({
  imageWidth,
  imageHeight,
  maxWidth,
  maxHeight,
}: {
  imageWidth: number
  imageHeight: number
  maxWidth: number
  maxHeight: number
}) => {
  if (imageWidth > imageHeight) {
    if (imageWidth > maxWidth) {
      return {
        width: maxWidth,
        height: imageHeight * (maxWidth / imageWidth),
      }
    }
  } else if (imageHeight > maxHeight) {
    return {
      width: imageWidth * (maxHeight / imageHeight),
      height: maxHeight,
    }
  }
  return {
    width: imageWidth,
    height: imageHeight,
  }
}

export const getImageDescription = async (thing: string) => {
  const response = await fetch(
    'http://localhost:3000/api/image/description/v1',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ thing }),
    }
  )

  return await response.json()
}
