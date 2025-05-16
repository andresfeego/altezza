import { createImage, getRadianAngle } from './utilsInternos';

export default async function getCroppedImgURL(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const rotRad = getRadianAngle(rotation);
  const bBox = {
    width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  };

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.translate(-pixelCrop.x, -pixelCrop.y);
  ctx.translate(image.width / 2, image.height / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  return canvas.toDataURL('image/webp');
}
