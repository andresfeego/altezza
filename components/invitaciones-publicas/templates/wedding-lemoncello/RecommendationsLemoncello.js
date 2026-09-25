import { RecommendationText } from '../../module-views/RecommendationsView';
import styles from './RecommendationsLemoncello.module.scss';

export default function RecommendationsLemoncello({ data }) {
  return <section className={styles.recommendations} data-recommendations aria-label={data.title || 'Recomendaciones'}>
    {data.title ? <h2 className={styles.title}>{data.title}</h2> : null}
    {data.text1 ? <p className={styles.intro}><RecommendationText text={data.text1} /></p> : null}
    {data.text2 ? <p className={styles.details}><RecommendationText text={data.text2} /></p> : null}
    {data.linkUrl ? <a className={styles.link} href={data.linkUrl} target="_blank" rel="noopener noreferrer">{data.linkLabel}</a> : null}
    {data.imageSrc ? <img className={styles.preload} src={data.imageSrc} alt="" aria-hidden="true" data-invitation-preload /> : null}
  </section>;
}
