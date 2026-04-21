import { useEffect, useRef, useState } from 'react';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ParallaxImageDateView({ data, styles }) {
  const sectionRef = useRef(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    function updateParallax() {
      const element = sectionRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
      setParallaxOffset((progress - 0.5) * 148);
    }

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax);

    return () => {
      window.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, []);

  if (!data?.backgroundImage || !data?.datePairs?.length) return null;

  return (
    <section ref={sectionRef} className={`${styles.moduleCard} ${styles.parallaxImageDateModule}`}>
      <div
        className={styles.parallaxImageDateBackgroundWrap}
        style={{ transform: `translate3d(0, ${parallaxOffset}px, 0)` }}
      >
        <img
          className={styles.parallaxImageDateBackground}
          src={data.backgroundImage}
          alt=""
          aria-hidden="true"
        />
      </div>
      <div
        className={styles.parallaxImageDateContent}
        style={{ transform: `translate3d(0, ${parallaxOffset * -1.05}px, 0)` }}
      >
        <div className={styles.parallaxImageDateDigits}>
          {data.datePairs.map((pair, index) => (
            <div key={`pair-${index}`} className={styles.parallaxImageDatePair}>
              <span>{pair[0]}</span>
              <span>{pair[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
