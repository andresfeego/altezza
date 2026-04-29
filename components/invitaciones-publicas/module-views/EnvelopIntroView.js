import { useEffect, useRef, useState } from 'react';
import envelopTopAsset from '../templates/wedding-classic/assets/images/envelop_top.png';
import envelopBottomAsset from '../templates/wedding-classic/assets/images/envelop_bottom.png';

export default function EnvelopIntroView({ styles }) {
  const envelopTopSrc = typeof envelopTopAsset === 'string' ? envelopTopAsset : envelopTopAsset?.src || '';
  const envelopBottomSrc = typeof envelopBottomAsset === 'string' ? envelopBottomAsset : envelopBottomAsset?.src || '';
  const [buttonFading, setButtonFading] = useState(false);
  const [opening, setOpening] = useState(false);
  const [moduleFading, setModuleFading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const sectionRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyTouchAction = body.style.touchAction;

    if (!hidden) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
    } else {
      html.style.overflow = prevHtmlOverflow || '';
      body.style.overflow = prevBodyOverflow || '';
      body.style.touchAction = prevBodyTouchAction || '';
    }

    return () => {
      html.style.overflow = prevHtmlOverflow || '';
      body.style.overflow = prevBodyOverflow || '';
      body.style.touchAction = prevBodyTouchAction || '';
    };
  }, [hidden]);

  function handleOpenIntro() {
    if (buttonFading || opening) return;
    setButtonFading(true);
    setOpening(true);

    if (typeof window !== 'undefined') {
      if (typeof window.__invMusicControls?.playUnmute === 'function') {
        window.__invMusicControls.playUnmute();
      } else {
        window.dispatchEvent(new CustomEvent('envelopIntro:open'));
      }
    }

    const OPENING_MS = 3000;
    const MODULE_FADE_MS = 2000;

    timersRef.current.push(setTimeout(() => {
      setModuleFading(true);
    }, OPENING_MS));

    timersRef.current.push(setTimeout(() => {
      setHidden(true);
      const section = sectionRef.current;
      if (!section) return;

      // Remove both the section and its flowBlock wrapper from layout/pointer flow.
      section.style.display = 'none';
      const flowBlock = section.parentElement;
      if (flowBlock) {
        flowBlock.style.display = 'none';
      }
    }, OPENING_MS + MODULE_FADE_MS));
  }

  return (
    <section
      ref={sectionRef}
      className={[
        styles.moduleCard,
        styles.envelopIntroModule || '',
        opening ? styles.envelopIntroOpening : '',
        moduleFading ? styles.envelopIntroModuleFading : '',
        buttonFading ? styles.envelopIntroButtonFading : '',
        hidden ? styles.envelopIntroHidden : '',
      ].join(' ')}
    >
      <div className={styles.envelopIntroEnvelope}>
        <div className={styles.envelopIntroTop}>
          <div className={styles.envelopIntroTopPanel}>
            <img src={envelopTopSrc} alt="" aria-hidden="true" className={styles.envelopIntroImage} />
          </div>
          <button
            type="button"
            className={styles.envelopIntroAnchorCircle}
            onClick={handleOpenIntro}
            disabled={buttonFading}
          >
            Abrir
          </button>
        </div>
        <div className={styles.envelopIntroBottom}>
          <img src={envelopBottomSrc} alt="" aria-hidden="true" className={styles.envelopIntroImage} />
        </div>
      </div>
    </section>
  );
}
