import terracotaDresscodeAsset from '../templates/wedding-terracota/assets/images/dresscode.png';
import classicDresscodeAsset from '../templates/wedding-classic/assets/images/dresscode.png';

const TERRACOTA_DRESSCODE_IMAGE = (
  typeof terracotaDresscodeAsset === 'string'
    ? terracotaDresscodeAsset
    : terracotaDresscodeAsset?.src || ''
);

const CLASSIC_DRESSCODE_IMAGE = (
  typeof classicDresscodeAsset === 'string'
    ? classicDresscodeAsset
    : classicDresscodeAsset?.src || ''
);

function normalizeColorList(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean);
}

export default function DressCodeModule({ module, evento }) {
  const templateKey = String(evento?.templateKey || '').trim();
  const attireLabel = String(module?.config?.attireLabel || '').trim();
  const imageSrc = String(
    (templateKey === 'wedding_terracota' ? TERRACOTA_DRESSCODE_IMAGE : '') ||
    (templateKey === 'wedding-classic' ? CLASSIC_DRESSCODE_IMAGE : '') ||
    module?.config?.imageSrc ||
    ''
  ).trim();
  const imageAlt = String(module?.config?.imageAlt || 'Referencia de dress code').trim();
  const suggestedColors = normalizeColorList(module?.config?.suggestedColors);
  const avoidedColors = normalizeColorList(module?.config?.avoidedColors);

  if (!attireLabel && !imageSrc && !suggestedColors.length && !avoidedColors.length) {
    return null;
  }

  return {
    attireLabel,
    imageSrc,
    imageAlt,
    suggestedColors,
    avoidedColors,
  };
}
