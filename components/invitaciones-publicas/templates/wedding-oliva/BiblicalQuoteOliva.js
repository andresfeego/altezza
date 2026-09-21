import BiblicalQuoteView from '../../module-views/BiblicalQuoteView';
import FloralReliefOliva from './FloralReliefOliva';
import heroStyles from './HeroOliva.module.scss';
import quoteStyles from './BiblicalQuoteOliva.module.scss';
import corner from './assets/images/quote-floral-corner-mask-v1.png';

export default function BiblicalQuoteOliva({ data, styles }) {
  return (
    <BiblicalQuoteView
      data={data}
      styles={{ ...styles, ...quoteStyles }}
      backgroundDecoration={<>
        <div className={quoteStyles.corner} aria-hidden="true" data-quote-corner="start">
          <FloralReliefOliva imageSrc={corner} loading="lazy" />
        </div>
        <div className={`${quoteStyles.corner} ${quoteStyles.cornerEnd}`} aria-hidden="true" data-quote-corner="end">
          <FloralReliefOliva imageSrc={corner} loading="lazy" />
        </div>
        <span className={heroStyles.movingLight} aria-hidden="true" />
      </>}
    />
  );
}
