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
