import seal from './assets/images/sello-lacre-abrir-v1-web-v1.webp';
import flower from './assets/images/rsvp-flower-mask-v1-web-v1.webp';
import corner from './assets/images/quote-floral-corner-mask-v1-web-v1.webp';
import paper from './assets/images/cotton-paper-v1-web-v1.webp';
import grain from './assets/images/paper-grain.svg';
import fibers from './assets/images/paper-fibers.svg';
import garland from './assets/images/floral-garland-v1.png';

const IMAGE_FIELDS = new Set(['imageSrc', 'backgroundSrc', 'backgroundDesktopSrc', 'envelopeSrc', 'monogramSrc', 'backgroundImage', 'logoImage', 'frameImage', 'reliefImageSrc', 'sealImageSrc', 'images']);
const MEDIA_FIELDS = { audioSrc: 'audio', backgroundVideoSrc: 'video', backgroundVideo: 'video', videoSrc: 'video' };
const srcOf = (value) => typeof value === 'string' ? value : value?.src;

export function collectOlivaMedia(modules) {
  const resources = new Map();
  const add = (kind, value) => {
    const src = srcOf(value);
    if (src) resources.set(`${kind}:${src}`, { kind, src });
  };
  const visit = (value, key = '') => {
    if (typeof value === 'string') {
      if (MEDIA_FIELDS[key]) add(MEDIA_FIELDS[key], value);
      else if (IMAGE_FIELDS.has(key)) add('image', value);
    } else if (Array.isArray(value)) value.forEach((item) => visit(item, key));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([name, item]) => visit(item, name));
  };
  for (const module of modules.filter((item) => item.enabled !== false)) {
    visit(module.data);
    visit(module.config?.sectionBackground);
    if (module.type === 'envelop_intro') add('image', seal);
    if (module.type === 'attendance_confirm') add('image', flower);
    if (module.type === 'biblical_quote' && (module.data?.passageText || module.data?.passageReference)) add('image', corner);
    if (module.type === 'closing_message' && module.data?.showFrame !== false && !module.data?.frameImage) add('image', garland);
  }
  if (modules.length) [paper, grain, fibers].forEach((src) => add('image', src));
  return [...resources.values()];
}

export function replacePreparedSources(value, blobs) {
  if (Array.isArray(value)) return value.map((item) => replacePreparedSources(item, blobs));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key,
    MEDIA_FIELDS[key] && typeof item === 'string' ? (blobs[item] || '') : replacePreparedSources(item, blobs),
  ]));
}

export const OLIVA_FONT_FACES = ['400 16px "Oliva Cormorant"', 'italic 400 16px "Oliva Cormorant"', '400 16px "Oliva Montserrat"', 'italic 400 16px "Oliva Montserrat"', '400 16px "Oliva Allura"', '400 16px "Oliva WindSong"'];
