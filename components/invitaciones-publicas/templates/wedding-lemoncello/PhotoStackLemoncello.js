import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './PhotoStackLemoncello.module.scss';

const ANGLES = [-3, 5, -7, 8, -5, 3, -1];
const EMPTY_DRAG = { x: 0, y: 0 };
// A short deliberate swipe is enough, independently of screen or photo size.
const SWIPE_DISTANCE = 16;

function PhotoDeck({ images, adjustments }) {
  const [order, setOrder] = useState(() => images.map((_, index) => index));
  const [drag, setDrag] = useState(EMPTY_DRAG);
  const [phase, setPhase] = useState('idle');
  const [hint, setHint] = useState(true);
  const [reduced, setReduced] = useState(false);
  const gesture = useRef(null);
  const busy = useRef(false);
  const timer = useRef(null);
  const suppressClick = useRef(false);
  const deckRef = useRef(null);
  const restoreFocus = useRef(false);
  const storageKey = `lemoncello:photo-hint:${images.join('|')}`;

  const hideHint = useCallback(() => {
    setHint(false);
    try { window.sessionStorage.setItem(storageKey, 'seen'); } catch { /* Private browsing may disallow storage. */ }
  }, [storageKey]);

  const finish = useCallback(() => {
    if (!busy.current) return;
    busy.current = false;
    restoreFocus.current = deckRef.current?.contains(document.activeElement);
    window.clearTimeout(timer.current);
    setOrder(previous => [...previous.slice(1), previous[0]]);
    setDrag(EMPTY_DRAG);
    setPhase('idle');
  }, []);

  useEffect(() => {
    if (restoreFocus.current) {
      restoreFocus.current = false;
      deckRef.current?.querySelector('[data-photo-top="true"]')?.focus({ preventScroll: true });
    }
  }, [order]);

  useEffect(() => {
    try { setHint(window.sessionStorage.getItem(storageKey) !== 'seen'); } catch { /* Keep the in-memory hint. */ }
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReduced(preference.matches); if (preference.matches) finish(); };
    update();
    preference.addEventListener('change', update);
    return () => { preference.removeEventListener('change', update); window.clearTimeout(timer.current); };
  }, [storageKey, finish]);

  const advance = useCallback((x = 1, y = 0) => {
    if (busy.current || images.length < 2) return;
    hideHint();
    busy.current = true;
    gesture.current = null;
    if (reduced) { finish(); return; }
    const distance = Math.max(window.innerWidth, window.innerHeight) * 1.35;
    const magnitude = Math.hypot(x, y) || 1;
    setDrag({ x: x / magnitude * distance, y: y / magnitude * distance });
    setPhase('leaving');
    timer.current = window.setTimeout(finish, 350);
  }, [images.length, hideHint, reduced, finish]);

  const cancelDrag = () => {
    if (busy.current) return;
    gesture.current = null;
    setDrag(EMPTY_DRAG);
    if (!busy.current) setPhase('idle');
  };
  const pointerDown = event => {
    if (busy.current || images.length < 2 || event.isPrimary === false || event.button !== 0 || gesture.current) return;
    suppressClick.current = false;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0 };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setPhase('dragging');
  };
  const pointerMove = event => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId || busy.current) return;
    current.dx = event.clientX - current.x;
    current.dy = event.clientY - current.y;
    if (Math.hypot(current.dx, current.dy) > 8) { hideHint(); suppressClick.current = true; }
    setDrag({ x: current.dx, y: current.dy });
  };
  const pointerUp = event => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const dx = event.clientX - current.x, dy = event.clientY - current.y;
    if (Math.hypot(dx, dy) >= SWIPE_DISTANCE) { suppressClick.current = true; advance(dx, dy); }
    else { setDrag(EMPTY_DRAG); setPhase('idle'); }
  };

  return <div ref={deckRef} className={styles.deck} data-photo-stack data-photo-active={order[0]} data-photo-phase={phase}>
    {order.map((imageIndex, rank) => {
      const top = rank === 0;
      const image = images[imageIndex];
      const adjustment = adjustments[image] || adjustments[image.split('/').pop()] || adjustments[String(imageIndex)] || {};
      const offset = top ? drag : EMPTY_DRAG;
      return <button key={image} type="button" className={`${styles.polaroid} ${top && phase === 'dragging' ? styles.dragging : ''}`}
        data-photo-card={imageIndex} data-photo-top={top} tabIndex={top ? 0 : -1} aria-hidden={!top || undefined}
        aria-label={`Foto ${imageIndex + 1} de ${images.length}. Desliza o pulsa para pasar.`}
        aria-disabled={top && busy.current || undefined}
        style={{ zIndex: images.length - rank, '--photo-x': `${offset.x}px`, '--photo-y': `${offset.y + rank * 2}px`, '--photo-angle': `${ANGLES[rank % ANGLES.length] + (top ? Math.max(-24, Math.min(24, offset.x / 18)) : 0)}deg`, '--photo-scale': 1 - Math.min(rank, 6) * .012 }}
        onPointerDown={top ? pointerDown : undefined} onPointerMove={top ? pointerMove : undefined}
        onPointerUp={top ? pointerUp : undefined} onPointerCancel={top ? cancelDrag : undefined}
        onLostPointerCapture={() => { if (gesture.current && !busy.current) cancelDrag(); }}
        onClick={top ? () => { if (suppressClick.current) { suppressClick.current = false; return; } advance(); } : undefined}
        onKeyDown={top ? event => {
          const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
          if (directions[event.key]) { event.preventDefault(); event.stopPropagation(); advance(...directions[event.key]); }
          if (event.key === 'Escape') { event.preventDefault(); cancelDrag(); }
        } : undefined}
        onTransitionEnd={event => { if (top && event.target === event.currentTarget && event.propertyName === 'transform' && phase === 'leaving') finish(); }}>
        <span className={styles.photoWindow}>
          <img src={image} alt={`Recuerdo ${imageIndex + 1}`} draggable={false}
            loading="eager" decoding="async"
            style={{ objectPosition: `${adjustment.positionX ?? 50}% ${adjustment.positionY ?? 50}%`, transform: `scale(${adjustment.zoom ?? 1})` }} />
        </span>
        <span className={styles.caption} aria-hidden="true">{top && hint && images.length > 1 ? 'Desliza' : ''}</span>
      </button>;
    })}
    <span className={styles.srOnly} role="status" aria-live="polite">Foto {order[0] + 1} de {images.length}</span>
  </div>;
}

export default function PhotoStackLemoncello({ data }) {
  const images = data?.images || [];
  if (!images.length) return null;
  return <div className={styles.scene}>
    {data.title ? <h2 className={styles.title}>{data.title}</h2> : null}
    <PhotoDeck key={images.join('|')} images={images} adjustments={data.imageAdjustments || {}} />
  </div>;
}
