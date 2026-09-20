import { useCallback, useEffect, useRef, useState } from 'react';
import ModuleSurface from '../../ModuleSurface';
import panorama from './assets/images/welcome-panorama-v1.webp';
import waiter from './assets/images/waiter-walk-v1.webp';
import arrow from './assets/images/scene-arrow-v1.webp';
import styles from './index.module.scss';

const src = asset => typeof asset === 'string' ? asset : asset.src;
export const ESCORT_MS = 6400;
const SLIDE_MS = 900;

// One promenade-sized interval connects the balcony to the next scene.
// Every stop stays on the horizontal axis, including reduced-motion mode.
export function sceneCell(index) {
  return { column: index === 0 ? 0 : index + 1, row: 0 };
}

export default function SceneCanvas({ modules, views, viewStyles, attendanceState, opened, focusRef }) {
  const [active, setActive] = useState(0);
  const [journey, setJourney] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const journeyRef = useRef(null);
  const panelsRef = useRef([]);
  const focusFrame = useRef(null);

  const focusPanel = useCallback(index => {
    cancelAnimationFrame(focusFrame.current);
    focusFrame.current = requestAnimationFrame(() => panelsRef.current[index]?.focus({ preventScroll: true }));
  }, []);

  const finish = useCallback(() => {
    const next = journeyRef.current;
    if (!next) return;
    journeyRef.current = null;
    setActive(next.to);
    setJourney(null);
    focusPanel(next.to);
  }, [focusPanel]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReducedMotion(preference.matches); if (preference.matches) finish(); };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, [finish]);

  useEffect(() => {
    if (!journey) return undefined;
    // Fallback if animation-end is lost while a tab is suspended.
    const timer = window.setTimeout(finish, journey.duration + 150);
    return () => window.clearTimeout(timer);
  }, [journey, finish]);

  useEffect(() => () => cancelAnimationFrame(focusFrame.current), []);

  const goTo = useCallback(to => {
    if (!opened || journeyRef.current || to < 0 || to >= modules.length || to === active) return;
    if (reducedMotion) { setActive(to); focusPanel(to); return; }
    const escort = modules[active]?.type === 'hero_image_1' && modules[to]?.type === 'welcome_message';
    const next = { from: active, to, escort, duration: escort ? ESCORT_MS : SLIDE_MS };
    journeyRef.current = next;
    setJourney(next);
  }, [opened, active, reducedMotion, modules, focusPanel]);

  const moving = Boolean(journey);
  const hasPromenade = modules.some(module => module.type === 'hero_image_1') && modules.some(module => module.type === 'welcome_message');
  const cameraVars = {
    '--camera-from': `${-100 * sceneCell(active).column}%`,
    '--camera-to': `${-100 * sceneCell(journey?.to ?? active).column}%`,
    '--journey-duration': `${journey?.duration || SLIDE_MS}ms`,
  };

  return <div className={styles.viewport} style={cameraVars} tabIndex={opened ? 0 : -1}
    role="region" aria-label="Contenido de la invitación" aria-busy={moving || undefined}
    inert={!opened ? '' : undefined} aria-hidden={!opened || undefined}
    data-scene-index={active} data-scene-moving={moving}
    onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1); }
    }}>
    <div className={`${styles.canvas} ${moving ? journey.escort ? styles.escorted : styles.sliding : ''}`}
      onAnimationEnd={event => { if (event.target === event.currentTarget) finish(); }}>
      {hasPromenade ? <div className={styles.scenery} aria-hidden="true">
        <img src={src(panorama)} alt="" data-invitation-preload />
      </div> : null}
      {modules.map((module, index) => {
        const View = views[module.type];
        return <section key={`${module.type}-${module.order}-${index}`} data-module={module.type}
          style={{ left: `${sceneCell(index).column * 100}%` }}
          className={`${styles.panel} ${styles[module.type] || ''}`}
          inert={index !== active ? '' : undefined} aria-hidden={index !== active || undefined}>
          <div ref={node => { panelsRef.current[index] = node; if (index === 0 && focusRef) focusRef.current = node; }}
            tabIndex={-1} className={styles.moduleContent}>
            <ModuleSurface background={module.config?.sectionBackground}>
              <View data={module.data} styles={viewStyles} attendanceState={attendanceState} />
            </ModuleSurface>
          </div>
        </section>;
      })}
    </div>
    {hasPromenade ? <div className={`${styles.waiterTrack} ${journey?.escort ? styles.waiterTravel : ''}`} aria-hidden="true">
      <div className={styles.waiterWindow}>
        <img className={styles.waiterFrames} src={src(waiter)} alt="" data-invitation-preload />
      </div>
    </div> : null}
    <nav className={styles.sceneNavigation} aria-label="Recorrido de la invitación">
      {active > 0 ? <button type="button" className={`${styles.sceneArrow} ${styles.previousArrow}`}
        aria-label="Volver a la escena anterior" disabled={!opened || moving} onClick={() => goTo(active - 1)}>
        <img src={src(arrow)} alt="" data-invitation-preload />
      </button> : null}
      {active < modules.length - 1 ? <button type="button" className={`${styles.sceneArrow} ${styles.nextArrow}`}
        aria-label={modules[active + 1]?.type === 'welcome_message' ? 'Ir al mensaje de bienvenida' : 'Ir a la siguiente escena'}
        disabled={!opened || moving} onClick={() => goTo(active + 1)}>
        <img src={src(arrow)} alt="" data-invitation-preload />
      </button> : null}
    </nav>
  </div>;
}
