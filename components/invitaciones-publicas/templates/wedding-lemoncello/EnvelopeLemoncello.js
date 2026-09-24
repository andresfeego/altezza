import { useEffect, useRef, useState } from 'react';
import EnvelopeBackground from '../../module-views/EnvelopeBackground';
import landscape from './assets/images/landscape-open-clear-v3.webp';
import vespa from './assets/images/vespa.webp';
import leftDoor from './assets/images/door-left-arched.webp';
import rightDoor from './assets/images/door-right-arched.webp';
import dog from './assets/images/dog.webp';
import basket from './assets/images/vespa-basket-soft.webp';
import plaque from './assets/images/majolica-plaque.webp';
import hangingSign from './assets/images/hanging-abrir.webp';
import frontWheel from './assets/images/vespa-wheel-front.webp';
import rearWheel from './assets/images/vespa-wheel-rear.webp';
import bodyMask from './assets/masks/vespa-body-mask.svg';
import arrow from './assets/images/scene-arrow-round-v1.webp';
import navigationStyles from './index.module.scss';
import styles from './EnvelopeLemoncello.module.scss';

const src = (asset) => typeof asset === 'string' ? asset : asset.src;
const ART = [landscape, vespa, leftDoor, rightDoor, dog, basket, plaque, hangingSign, frontWheel, rearWheel, bodyMask, arrow].map(src);
const TRAVEL_MS = 6000;
const OPEN_MS = 3600;

export default function EnvelopeLemoncello({ data = {}, onStart, onOpen, presentationReady = true }) {
  const rootRef = useRef(null);
  const startedRef = useRef(false);
  const rideStartedRef = useRef(false);
  const openRef = useRef(null);
  const [phase, setPhase] = useState('loading');
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);
  const customMedia = Boolean(data.backgroundSrc || data.backgroundDesktopSrc || data.backgroundVideoSrc || data.envelopeSrc || data.monogramSrc);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (customMedia) { setPhase('waiting'); return undefined; }
    let cancelled = false;
    let settled = false;
    const pending = [];
    const load = Promise.all(ART.map((url) => new Promise((resolve) => {
      const image = new window.Image();
      pending.push(image);
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = url;
    })));
    const deadline = setTimeout(() => {
      if (!cancelled) { settled = true; setFailed(true); setPhase('waiting'); }
    }, 10000);
    load.then((results) => {
      clearTimeout(deadline);
      if (cancelled || settled) return;
      settled = true;
      const missing = results.some((ok) => !ok);
      setFailed(missing);
      setPhase('waiting');
    });
    return () => {
      cancelled = true;
      clearTimeout(deadline);
      pending.forEach((image) => { image.onload = null; image.onerror = null; });
    };
  }, [customMedia]);

  useEffect(() => {
    if (phase === 'travel') {
      if (reduced) { setPhase('arrived'); return undefined; }
      if (!presentationReady) return undefined;
      const timer = setTimeout(() => setPhase('arrived'), TRAVEL_MS);
      return () => clearTimeout(timer);
    }
    if (phase === 'opening') {
      if (reduced) { onOpen?.(); return undefined; }
      const timer = setTimeout(() => onOpen?.(), OPEN_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [phase, reduced, onOpen, presentationReady]);

  useEffect(() => {
    if (phase === 'arrived') openRef.current?.focus({ preventScroll: true });
  }, [phase]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const measure = () => {
      const { width, height } = root.getBoundingClientRect();
      // Artwork coordinates are presentation only. Event copy comes exclusively from data.
      // All layers use the same image-space unit. Raster height always stays automatic.
      const unit = height / 724;
      const worldWidth = 2172 * unit;
      const doorX = 1542 * unit;
      const cameraDoorX = Math.min(width * .51, width - 160 * unit - 8);
      const cameraEnd = cameraDoorX - doorX;
      // The user's red line is about 9% of the previous frame width from its left edge.
      // Keep the departure point and move the final camera right by that amount.
      const framingShift = width * .09;
      const originalCameraTravel = height * 3 * .832 - width * .48;
      root.style.setProperty('--world-width', `${worldWidth}px`);
      root.style.setProperty('--scene-unit', `${unit}px`);
      // Half the ORIGINAL journey distance, rather than half the previous short approach.
      root.style.setProperty('--travel-start-x', `${cameraEnd + originalCameraTravel / 2}px`);
      root.style.setProperty('--travel-x', `${cameraEnd - framingShift}px`);
      root.style.setProperty('--door-radius', `${87 * unit}px`);
      root.style.setProperty('--opening-x', `${cameraDoorX - framingShift}px`);
      // Keep the plaque on the wall beyond the stone jamb. The user's 10px outer
      // margin belongs to the viewport; artwork sizes continue to share one scale.
      const signWorldLeft = 1653 * unit;
      const signScreenLeft = signWorldLeft + cameraEnd - framingShift;
      root.style.setProperty('--sign-left', `${signWorldLeft}px`);
      root.style.setProperty('--sign-width', `${Math.max(0, width - 10 - signScreenLeft)}px`);
      // Original screen displacement was -.14 widths; halving this also halves the
      // scooter's complete world-space journey (camera travel + screen displacement).
      const vespaStart = Math.min(width * .10, width - 312 * unit * (1478 / 1536));
      root.style.setProperty('--vespa-start', `${vespaStart}px`);
      root.style.setProperty('--vespa-end', `${vespaStart - width * .07 - framingShift}px`);
      // Roll by actual distance travelled in the artwork, not by the camera's motion.
      const wheelDiameter = 330 / 1536 * 312 * unit;
      const ridingDistance = originalCameraTravel / 2 - width * .07;
      root.style.setProperty('--wheel-turn', `${wheelDiameter > 0 ? ridingDistance / (Math.PI * wheelDiameter) * 360 : 0}deg`);
    };
    measure();
    if (!window.ResizeObserver) {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new window.ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  function startMusic() {
    // Invoke play synchronously inside the original click for mobile audio policies.
    if (typeof window.__invMusicControls?.playUnmute === 'function') window.__invMusicControls.playUnmute();
    else window.dispatchEvent(new window.Event('envelopIntro:open'));
  }

  function start() {
    if (rideStartedRef.current || phase !== 'waiting' || !presentationReady) return;
    rideStartedRef.current = true;
    startMusic();
    onStart?.();
    setPhase(reduced || failed || customMedia ? 'arrived' : 'travel');
  }

  function open() {
    if (startedRef.current || phase !== 'arrived') return;
    startedRef.current = true;
    startMusic();
    if (reduced || failed || customMedia) onOpen?.();
    else setPhase('opening');
  }

  const ready = phase === 'arrived' || phase === 'opening';
  const openControl = (
    <button ref={openRef} type="button" className={styles.open} onClick={open}
      disabled={!ready || phase === 'opening'} aria-label="Abrir invitación"
      aria-busy={phase === 'opening' || undefined}>
      {failed ? <span className={styles.openFallback}>Abrir</span>
        : <img src={ART[7]} alt="" aria-hidden="true" data-invitation-preload />}
    </button>
  );
  return (
    <section ref={rootRef} className={styles.scene} data-envelope-phase={phase}
      data-presentation-ready={presentationReady || undefined}
      data-reduced-motion={reduced || undefined} data-custom-media={customMedia || undefined}
      data-failed={failed || undefined} aria-label="Sobre de la invitación"
      style={{ '--travel-duration': `${TRAVEL_MS}ms`, '--opening-duration': `${OPEN_MS}ms` }}>
      {customMedia ? <EnvelopeBackground data={data} active={phase !== 'opening'} /> : null}
      <div className={styles.zoom}>
        {!customMedia && !failed ? <>
          <div className={styles.world}>
            <img className={styles.landscape} src={ART[0]} alt="" aria-hidden="true" data-invitation-preload />
            <div className={styles.doorway} aria-hidden="true">
              <div className={`${styles.leaf} ${styles.left}`}><img src={ART[2]} alt="" data-invitation-preload /></div>
              <div className={`${styles.leaf} ${styles.right}`}><img src={ART[3]} alt="" data-invitation-preload /></div>
            </div>
            {openControl}
            <div className={styles.sign}>
              <img className={styles.signArt} src={ART[6]} alt="" aria-hidden="true" data-invitation-preload />
              <div className={styles.signCopy}>
                {data.invitationLabel ? <span>{data.invitationLabel}</span> : null}
                {data.eventDate ? <time>{data.eventDate}</time> : null}
              </div>
            </div>
            <img className={styles.dog} src={ART[4]} alt="Perrito con pañuelo azul junto a la entrada" data-invitation-preload />
          </div>
          <div className={styles.vespa} role="img" aria-label="Vespa amarilla con canasta de limones y flores, sin personas"
            style={{ '--vespa-body-mask': `url(${JSON.stringify(ART[10])})` }}>
            <img className={styles.maskPreload} src={ART[10]} alt="" aria-hidden="true" data-invitation-preload />
            <img className={`${styles.wheel} ${styles.frontWheel}`} src={ART[8]} alt="" aria-hidden="true" data-invitation-preload />
            <img className={`${styles.wheel} ${styles.rearWheel}`} src={ART[9]} alt="" aria-hidden="true" data-invitation-preload />
            <img className={styles.vespaBody} src={ART[1]} alt="" aria-hidden="true" data-invitation-preload />
            <img className={styles.basket} src={ART[5]} alt="" aria-hidden="true" data-invitation-preload />
          </div>
        </> : <div className={styles.fallback}>
          {data.envelopeSrc ? <img src={data.envelopeSrc} alt="" /> : null}
          {data.monogramSrc ? <img className={styles.monogram} src={data.monogramSrc} alt="" /> : null}
          {data.invitationLabel ? <p>{data.invitationLabel}</p> : null}
          {data.eventDate ? <time>{data.eventDate}</time> : null}
        </div>}
        {customMedia || failed ? openControl : null}
      </div>
      {phase === 'waiting' && presentationReady ? <button type="button"
        className={`${navigationStyles.sceneArrow} ${navigationStyles.nextArrow} ${styles.startArrow}`}
        aria-label="Comenzar invitación" onClick={start}>
        <img src={ART[11]} alt="" data-invitation-preload />
      </button> : null}
      {phase === 'loading' ? <p className={styles.status} role="status">Cargando invitación…</p> : null}
    </section>
  );
}
