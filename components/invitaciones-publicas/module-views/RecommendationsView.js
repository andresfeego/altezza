import { recommendationUrl } from '../modules/RecommendationsModule';

// Only explicit Markdown links are supported; all other text remains escaped.
// This lets text2 contain a WhatsApp number without making the module hotel-specific.
export function RecommendationText({ text }) {
  const parts = []; let cursor = 0;
  for (const match of String(text || '').matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)) {
    parts.push(text.slice(cursor, match.index));
    const href = recommendationUrl(match[2]);
    parts.push(href ? <a key={match.index} href={href} target="_blank" rel="noopener noreferrer">{match[1]}</a> : match[1]);
    cursor = match.index + match[0].length;
  }
  parts.push(String(text || '').slice(cursor));
  return parts;
}

export default function RecommendationsView({ data, styles }) {
  if (!data) return null;
  return <section className={`${styles.moduleCard || ''} ${styles.recommendationsModule}`} data-recommendations>
    {data.title ? <h2 className={styles.recommendationsTitle}>{data.title}</h2> : null}
    {data.text1 ? <p className={styles.recommendationsText}><RecommendationText text={data.text1} /></p> : null}
    {data.text2 ? <p className={styles.recommendationsText}><RecommendationText text={data.text2} /></p> : null}
    {data.imageSrc ? <img className={styles.recommendationsImage} src={data.imageSrc} alt={data.imageAlt} /> : null}
    {data.linkUrl ? <a className={styles.recommendationsLink} href={data.linkUrl} target="_blank" rel="noopener noreferrer">{data.linkLabel}</a> : null}
  </section>;
}
