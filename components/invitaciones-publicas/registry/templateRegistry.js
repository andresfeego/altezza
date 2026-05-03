import WeddingClassicTemplate from '../templates/wedding-classic';
import { normalizeTemplateKey } from './templateKey';
import WeddingTerracotaTemplate from '../templates/wedding-terracota';

export const TEMPLATE_COMPONENTS = {
  wedding_classic: WeddingClassicTemplate,
  wedding_terracota: WeddingTerracotaTemplate,
};

export function resolveTemplateComponent(templateKey) {
  const normalizedKey = normalizeTemplateKey(templateKey);
  return TEMPLATE_COMPONENTS[normalizedKey] || WeddingClassicTemplate;
}
