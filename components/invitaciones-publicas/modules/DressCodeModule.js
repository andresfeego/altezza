import terracotaDresscodeAsset from '../templates/wedding-terracota/assets/images/dresscode.png';
import classicDresscodeAsset from '../templates/wedding-classic/assets/images/dresscode.png';
import { normalizeTemplateKey } from '../registry/templateKey';

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
  const templateKey = normalizeTemplateKey(evento?.templateKey);
  const attireLabel = String(module?.config?.attireLabel || '').trim();
  const imageSrc = String(
    module?.config?.imageSrc ||
    (templateKey === 'wedding_terracota' ? TERRACOTA_DRESSCODE_IMAGE : '') ||
    (templateKey === 'wedding_classic' ? CLASSIC_DRESSCODE_IMAGE : '') ||
    ''
  ).trim();
  const imageAlt = String(module?.config?.imageAlt || 'Referencia de dress code').trim();
  const suggestedColors = normalizeColorList(module?.config?.suggestedColors);
  const avoidedColors = normalizeColorList(module?.config?.avoidedColors);

  if (!attireLabel && !imageSrc && !suggestedColors.length && !avoidedColors.length) {
    return null;
  }

  return {
    title: String(module?.config?.title || '').trim(),
    message: String(module?.config?.message || '').trim(),
    attireLabel,
    imageSrc,
    imageAlt,
    suggestedColors,
    avoidedColors,
  };
}
