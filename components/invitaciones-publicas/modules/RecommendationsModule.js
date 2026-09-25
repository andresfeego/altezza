export function recommendationUrl(value, allowLocal = false) {
  const url = String(value || '').trim();
  if (!url || /[\u0000-\u001f\u007f\\]/.test(url)) return '';
  if (allowLocal && url.startsWith('/') && !url.startsWith('//')) return url;
  try { return ['https:', 'http:'].includes(new URL(url).protocol) ? url : ''; }
  catch { return ''; }
}

export default function RecommendationsModule({ module }) {
  const config = module?.config || {};
  const data = {
    title: String(config.title || '').trim(),
    text1: String(config.text1 || '').trim(),
    text2: String(config.text2 || '').trim(),
    imageSrc: recommendationUrl(config.imageSrc, true),
    imageAlt: String(config.imageAlt || '').trim(),
    linkUrl: recommendationUrl(config.linkUrl),
    linkLabel: String(config.linkLabel || 'Ver web').trim(),
  };
  return [data.title, data.text1, data.text2, data.imageSrc, data.linkUrl].some(Boolean) ? data : null;
}
