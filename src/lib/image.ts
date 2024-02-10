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
}): { width: number; height: number } => {
  if (imageWidth > imageHeight && imageWidth > maxWidth) {
    return {
      width: maxWidth,
      height: imageHeight * (maxWidth / imageWidth),
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
