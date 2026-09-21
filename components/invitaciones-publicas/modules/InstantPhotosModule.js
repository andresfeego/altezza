export default function InstantPhotosModule({ module }) {
  const config = module?.config || {};
  const images = Array.isArray(config.images) ? config.images : [];
  // A pair is the content of this module; never fill a missing slot from the hero.
  if (images.length !== 2 || images.some((image) => !String(image?.imageSrc || '').trim())) return null;

  return {
    images: images.map((image, index) => ({
      imageSrc: String(image.imageSrc).trim(),
      imageAlt: String(image.imageAlt || `Fotografía de la pareja ${index + 1}`).trim(),
    })),
    sealImageSrc: String(config.sealImageSrc || '').trim(),
    sealImageAlt: String(config.sealImageAlt || 'Sello de lacre con monograma').trim(),
    message: String(config.message || '').trim(),
    reliefImageSrc: String(config.reliefImageSrc || '').trim(),
  };
}
