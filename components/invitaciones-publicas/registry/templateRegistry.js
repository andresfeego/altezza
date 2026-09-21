import WeddingOlivaTemplate from '../templates/wedding-oliva';
import WeddingLemoncelloTemplate from '../templates/wedding-lemoncello';
import WeddingClassicTemplate from '../templates/wedding-classic';
import { normalizeTemplateKey } from './templateKey';
import WeddingTerracotaTemplate from '../templates/wedding-terracota';

export const TEMPLATE_COMPONENTS = {
  wedding_lemoncello: WeddingLemoncelloTemplate,
  wedding_oliva: WeddingOlivaTemplate,
  wedding_classic: WeddingClassicTemplate,
  wedding_terracota: WeddingTerracotaTemplate,
};

export function resolveTemplateComponent(templateKey) {
  const normalizedKey = normalizeTemplateKey(templateKey);
  return TEMPLATE_COMPONENTS[normalizedKey] || WeddingClassicTemplate;
}
