import { useEffect, useRef, useState } from 'react';

import flowerCord1Asset from '../templates/wedding-terracota/assets/images/flower_cord1.png';

export default function EnvelopIntroTerracotaView({ data, styles }) {
  const flowerCord1Src = typeof flowerCord1Asset === 'string' ? flowerCord1Asset : flowerCord1Asset?.src || '';
  const fullCord2Path1 =
    'M21725.56 612.69c-6338.74,1149.93 -12120.78,1851.91 -16414.12,1717.6 1395.84,22.84 2309.69,-1108.22 3045.73,-1443.42 362.45,-165.07 987.17,218.25 1148.43,690.52 291.29,853.01 -1096.77,1177.02 -4194.15,752.9 1738.85,158.53 2500.57,966.39 2285.12,2423.61 -169.65,1116.76 72.7,1855.39 727.08,2215.88 1109.31,793.06 1220.17,3116.29 -303.99,3755.17 -302.98,180.12 24.11,-20.41 -180.74,122.62 -762.38,557.54 -785.45,1169.22 -69.25,1835.02 998.83,848.65 1252.74,1344.93 761.7,1488.8';
  const fullCord2Path2 =
    'M173.95 1884.39c1613.05,423.41 3325.55,572.04 5137.51,445.9 -39.43,-324.9 -273.43,-573.68 -702,-746.31 -759.89,-231.62 -1508,-54.9 -2244.27,530.14 -325.39,507.49 39.82,695.99 1095.63,565.47 1233.76,-232.88 1850.64,-349.32 1850.64,-349.32 -2684.91,2194.78 -2936.59,4078.35 -755.01,5650.7 1991.28,1179.24 2344.71,2333.76 1060.28,3463.58 -933.83,819.06 -1086.99,1955.9 -459.46,3410.57';
  const fullCord2Path3 =
    'M21905.82 1510.75c-959.81,622.92 -6243.43,863.43 -15850.89,721.54 408.84,-156.24 831.55,-489.03 1268.13,-998.33 423.89,-589.86 826.94,-944.36 1209.16,-1063.48 827.24,-27.24 1108.88,482.64 844.95,1529.66 -282.21,742.51 -1389.63,919.9 -3322.24,532.15 3213.9,1306.92 3908.37,2728.69 2083.41,4265.3 -1049.88,1326.08 -1147.51,2676.68 -292.9,4051.8 660.45,1098.64 899.11,1863.43 715.98,2294.4 -119.42,487.64 -129.43,930.17 -30.04,1327.6';
  const fullCord2Path4 =
    'M169.47 2626.99c906.52,460.66 2868.33,329.09 5885.46,-394.7 -2242.54,-1669.49 -3510.61,-1786.96 -3804.19,-352.42 -281.9,1142.32 986.17,1259.78 3804.17,352.43 -694.77,144.44 -1215.7,364.95 -1562.8,661.53 -1483.64,1029.28 -1182.55,2578.08 903.31,4646.39 1734.1,1533.25 1628.42,3195.68 -317,4987.34';
  const [started, setStarted] = useState(false);
  const [buttonFading, setButtonFading] = useState(false);
  const [cordsFading, setCordsFading] = useState(false);
  const [panelsExit, setPanelsExit] = useState(false);
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
    if (started) return;
    setButtonFading(true);
    setStarted(true);

    if (typeof window !== 'undefined') {
      if (typeof window.__invMusicControls?.playUnmute === 'function') {
        window.__invMusicControls.playUnmute();
      } else {
        window.dispatchEvent(new CustomEvent('envelopIntro:open'));
      }
    }

    const CORDS_TOTAL_MS = 2100;
    const CORDS_FADE_MS = 2000;
    const PANELS_EXIT_MS = 1200;
    const PANELS_OVERLAP_MS = 400;

    timersRef.current.push(setTimeout(() => setCordsFading(true), CORDS_TOTAL_MS));
    timersRef.current.push(
      setTimeout(
        () => setPanelsExit(true),
        CORDS_TOTAL_MS + CORDS_FADE_MS - PANELS_OVERLAP_MS
      )
    );
    timersRef.current.push(setTimeout(() => {
      setHidden(true);
      const section = sectionRef.current;
      if (!section) return;

      section.style.display = 'none';
      const flowBlock = section.parentElement;
      if (flowBlock) {
        flowBlock.style.display = 'none';
      }
    }, CORDS_TOTAL_MS + CORDS_FADE_MS - PANELS_OVERLAP_MS + PANELS_EXIT_MS));
  }

  return (
    <section
      ref={sectionRef}
      className={[
        styles.moduleCard,
        styles.envelopIntroModule || '',
        started ? styles.envelopIntroAnimating : '',
        buttonFading ? styles.envelopIntroButtonFading : '',
        cordsFading ? styles.envelopIntroCordsFading : '',
        panelsExit ? styles.envelopIntroPanelsExit : '',
        hidden ? styles.envelopIntroHidden : '',
      ].join(' ')}
    >
      <div className={styles.envelopIntroSplit}>
        <div className={styles.envelopIntroFlapRight}>
          <div className={styles.envelopIntroContentWrap}>
            <div className={styles.envelopIntroInitialsBlock}>
              <span className={styles.envelopIntroInitials}>
                <span className={styles.envelopIntroInitialsFirst}>
                  {(data?.initials || '').charAt(0)}
                </span>
                <span className={styles.envelopIntroInitialsSecond}>
                  {(data?.initials || '').charAt(1)}
                </span>
              </span>
            </div>
            <div className={styles.envelopIntroTextBlock}>
              <div className={styles.envelopIntroNamesBlock}>
                <span className={styles.envelopIntroBrideName}>{data?.brideName || ''}</span>
                <span className={styles.envelopIntroAmpersand}>&</span>
                <span className={styles.envelopIntroGroomName}>{data?.groomName || ''}</span>
              </div>
              <div className={styles.envelopIntroDateBlock}>
                <span className={styles.envelopIntroDate}>{data?.eventDate || ''}</span>
              </div>
            </div>
          </div>
          {data?.invitationLabel ? (
            <div className={styles.envelopIntroInvitationLabel}>
              {data.invitationLabel}
            </div>
          ) : null}
        </div>
        <div className={styles.envelopIntroFlapLeft}>
          <img
            className={styles.envelopIntroFlapLeftDecoration}
            src={flowerCord1Src}
            alt=""
            aria-hidden="true"
          />
          <span className={styles.envelopIntroFlapOverlay} aria-hidden="true" />
        </div>
        <div className={styles.envelopIntroCanvas}>
          <svg
            className={styles.envelopIntroSvg}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 22075.28 15024.65"
            preserveAspectRatio="xMidYMin meet"
            aria-hidden="true"
          >
            <path
              className={`${styles.envelopCordRun} ${styles.envelopCordRunThin} ${styles.envelopCordA}`}
              pathLength="1"
              style={{ '--cord-delay': '0s' }}
              d={fullCord2Path1}
            />
            <path
              className={`${styles.envelopCordRun} ${styles.envelopCordRunThick} ${styles.envelopCordB}`}
              pathLength="1"
              style={{ '--cord-delay': '0s' }}
              d={fullCord2Path2}
            />
            <path
              className={`${styles.envelopCordRun} ${styles.envelopCordRunThick} ${styles.envelopCordC} ${styles.envelopCordRunOppositeErase}`}
              pathLength="1"
              style={{ '--cord-delay': '0s' }}
              d={fullCord2Path3}
            />
            <path
              className={`${styles.envelopCordRun} ${styles.envelopCordRunThick} ${styles.envelopCordD} ${styles.envelopCordRunOppositeErase}`}
              pathLength="1"
              style={{ '--cord-delay': '0s' }}
              d={fullCord2Path4}
            />
          </svg>
        </div>
        <button
          type="button"
          className={styles.envelopIntroAnchorCircle}
          onClick={handleOpenIntro}
          disabled={started}
        >
          Abrir
        </button>
      </div>
    </section>
  );
}
