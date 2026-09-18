import terracotaDresscodeAsset from '../templates/wedding-terracota/assets/images/dresscode.png';
import classicDresscodeAsset from '../templates/wedding-classic/assets/images/dresscode.png';
import { normalizeTemplateKey } from '../registry/templateKey';
import { normalizeDressCodePalette } from './dressCodePalette';

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

export default function DressCodeModule({ module, evento }) {
  const templateKey = normalizeTemplateKey(evento?.templateKey);
  const title = String(module?.config?.title || '').trim();
  const message = String(module?.config?.message || '').trim();
  const attireLabel = String(module?.config?.attireLabel || '').trim();
  const imageSrc = String(
    module?.config?.imageSrc ||
    (templateKey === 'wedding_terracota' ? TERRACOTA_DRESSCODE_IMAGE : '') ||
    (templateKey === 'wedding_classic' ? CLASSIC_DRESSCODE_IMAGE : '') ||
    ''
  ).trim();
  const imageAlt = String(module?.config?.imageAlt || 'Referencia de dress code').trim();
  const suggestedColors = normalizeDressCodePalette(module?.config?.suggestedColors);
  const avoidedColors = normalizeDressCodePalette(module?.config?.avoidedColors);

  if (!title && !message && !attireLabel && !imageSrc && !suggestedColors.length && !avoidedColors.length) {
    return null;
  }

  return {
    title,
    message,
    attireLabel,
    imageSrc,
    imageAlt,
    suggestedColors,
    avoidedColors,
    suggestedColorsTitle: String(module?.config?.suggestedColorsTitle ?? 'Paleta de colores sugerida').trim(),
    avoidedColorsTitle: String(module?.config?.avoidedColorsTitle ?? 'Evita estos colores').trim(),
  };
}
