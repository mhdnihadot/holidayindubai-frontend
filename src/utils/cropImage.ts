export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false },
  targetWidth?: number,
  targetHeight?: number
): Promise<Blob | null> {
  const image = await createImage(imageSrc)
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')

  if (!tempCtx) {
    return null
  }

  const rotRad = (rotation * Math.PI) / 180

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = {
    width:
      Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height:
      Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  }

  // set canvas size to match the bounding box
  tempCanvas.width = bBoxWidth
  tempCanvas.height = bBoxHeight

  // translate canvas context to a central location to allow rotating and flipping around the center
  tempCtx.translate(bBoxWidth / 2, bBoxHeight / 2)
  tempCtx.rotate(rotRad)
  tempCtx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  tempCtx.translate(-image.width / 2, -image.height / 2)

  // draw rotated image
  tempCtx.drawImage(image, 0, 0)

  // Create destination canvas with target crop/resize size
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const destWidth = targetWidth || pixelCrop.width
  const destHeight = targetHeight || pixelCrop.height

  canvas.width = destWidth
  canvas.height = destHeight

  // Draw the cropped portion from tempCanvas, scaling it to target output dimensions
  ctx.drawImage(
    tempCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    destWidth,
    destHeight
  )

  // As a blob
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/webp', 0.8)
  })
}
