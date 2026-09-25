import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ModuleSurface from '../../ModuleSurface';
import DateSceneLemoncello from './DateSceneLemoncello';
import { groupSceneModules, isEventScenePair } from './sceneModules';
import FireworkTransitionLemoncello from './FireworkTransitionLemoncello';
import ChapelWind from './ChapelWind';
import NightStars from './NightStars';
import DressCodeTransitionLemoncello from './DressCodeTransitionLemoncello';
import { DRESS_FIREWORKS_MS, DRESS_COVER_MS, DRESS_RETURN_MS, DRESS_RETURN_COVER_MS } from './dressCodeTransition';
import UmbrellaTransitionLemoncello from './UmbrellaTransitionLemoncello';
import { UMBRELLA_MS, UMBRELLA_COVER_MS } from './umbrellaTransition';
import panorama from './assets/images/welcome-panorama-v1.webp';
import connectedPanorama from './assets/images/hero-quote-continuous-v2.webp';
import waiter from './assets/images/waiter-walk-v1.webp';
import arrow from './assets/images/scene-arrow-round-v1.webp';
import photoGarden from './assets/images/photo-garden-v1.webp';
import quotePanorama from './assets/images/quote-photo-panorama-v2.webp';
import quoteCanopy from './assets/images/quote-lemon-canopy-v1.webp';
import bird from './assets/images/hero-bird-flight-v1.webp';
import gardenPanorama from './assets/images/chapel-reference-day-v1.webp';
import gardenNightPanorama from './assets/images/chapel-reference-night-v1.webp';
import composition from './gardenComposition.json';
import { cameraTransform, gardenGeometry } from './gardenCamera';
import styles from './index.module.scss';

const src = asset => typeof asset === 'string' ? asset : asset.src;
export const ESCORT_MS = 6400;
export const PHOTO_JOURNEY_MS = 3000;
export const RECEPTION_MS = 4000;
export const CEREMONY_MS = 2200;
export const SKY_MS = 4800;
const SLIDE_MS = 900;
const isPaperScene = module => ['dresscode', 'attendance_confirm', 'closing_message'].includes(module?.type);
const isVerticalPair = (from, to) => from?.type === 'dresscode' && to?.type === 'attendance_confirm';
const isDateScene = module => ['countdown', 'save_the_date_calendar'].includes(module?.type);
const isGardenNeighbor = (from, to) => isDateScene(from) && to?.type === 'event_details';
const isSkyNeighbor = (from, to) => (from?.type === 'event_details' && to?.type === 'gift_envelopes')
  || (from?.type === 'gift_envelopes' && to?.type === 'recommendations')
  || (from?.type === 'recommendations' && to?.type === 'dresscode')
  || (from?.type === 'dresscode' && to?.type === 'attendance_confirm');

// A promenade-sized interval connects each of the first three scenes.
// Date is a viewport overlay; adjacent event details retain the garden's position.
export function sceneCell(index, modules = []) {
  const depthStops = modules.slice(0, index + 1).filter((module, i) => i > 0 && (isGardenNeighbor(modules[i - 1], module) || isEventScenePair(modules[i - 1], module) || isSkyNeighbor(modules[i - 1], module))).length;
  const horizontalIndex = index - depthStops;
  return { column: horizontalIndex < 3 ? horizontalIndex * 2 : horizontalIndex + 2, row: 0 };
}

export default function SceneCanvas({ modules: sourceModules, views, viewStyles, attendanceState, opened, focusRef }) {
  const modules = useMemo(() => groupSceneModules(sourceModules), [sourceModules]);
  const [active, setActive] = useState(0);
  const [journey, setJourney] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const journeyRef = useRef(null);
  const panelsRef = useRef([]);
  const focusFrame = useRef(null);
  const focusPending = useRef(null);
  const viewportRef = useRef(null);
  const [size, setSize] = useState({ width: 480, height: 800 });

  useEffect(() => {
    const measure = () => {
      const width = viewportRef.current?.clientWidth, height = viewportRef.current?.clientHeight;
      if (width && height) setSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (viewportRef.current) observer?.observe(viewportRef.current);
    window.addEventListener('resize', measure);
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const focusPanel = useCallback(index => {
    cancelAnimationFrame(focusFrame.current);
    focusFrame.current = requestAnimationFrame(() => panelsRef.current[index]?.focus({ preventScroll: true }));
  }, []);

  const finish = useCallback(() => {
    const next = journeyRef.current;
    if (!next) return;
    journeyRef.current = null;
    focusPending.current = next.to;
    setActive(next.to);
    setJourney(null);
  }, []);

  const revealCoveredScene = useCallback(() => {
    const current = journeyRef.current;
    if (!current?.coverMs || current.covered) return;
    const next = { ...current, covered: true };
    journeyRef.current = next;
    setJourney(next);
  }, []);

  // Focus only after React removes inert from the destination panel.
  useEffect(() => {
    if (focusPending.current !== active) return;
    focusPending.current = null;
    focusPanel(active);
  }, [active, focusPanel]);

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
    const coverTimer = journey.coverMs ? window.setTimeout(revealCoveredScene, journey.coverMs) : null;
    return () => { window.clearTimeout(timer); if (coverTimer !== null) window.clearTimeout(coverTimer); };
    // Updating covered at the midpoint must not restart either clock.
  }, [journey?.from, journey?.to, journey?.duration, finish, revealCoveredScene]);

  useEffect(() => () => cancelAnimationFrame(focusFrame.current), []);

  const goTo = useCallback(to => {
    if (!opened || journeyRef.current || to < 0 || to >= modules.length || to === active) return;
    if (reducedMotion) { focusPending.current = to; setActive(to); return; }
    const fromType = modules[active]?.type, toType = modules[to]?.type;
    const paperScroll = isPaperScene(modules[active]) && isPaperScene(modules[to]);
    const verticalScroll = isVerticalPair(modules[active], modules[to]) || isVerticalPair(modules[to], modules[active]);
    const escort = fromType === 'hero_image_1' && toType === 'biblical_quote' ? 'waiter'
      : fromType === 'biblical_quote' && toType === 'image_slider_1' ? 'bird' : null;
    const photoJourney = (fromType === 'biblical_quote' && toType === 'image_slider_1')
      || (fromType === 'image_slider_1' && toType === 'biblical_quote');
    const umbrella = isDateScene(modules[active]) || isDateScene(modules[to]);
    const skyTravel = fromType === 'gift_envelopes' || toType === 'gift_envelopes';
    const dressTransition = fromType === 'recommendations' && toType === 'dresscode' ? 'fireworks'
      : fromType === 'dresscode' && toType === 'recommendations' ? 'return' : null;
    const eventTransition = isEventScenePair(modules[active], modules[to]) ? 'reception'
      : isEventScenePair(modules[to], modules[active]) ? 'ceremony' : null;
    const duration = umbrella ? UMBRELLA_MS : dressTransition ? (dressTransition === 'fireworks' ? DRESS_FIREWORKS_MS : DRESS_RETURN_MS) : skyTravel ? SKY_MS : eventTransition === 'reception' ? RECEPTION_MS : eventTransition === 'ceremony' ? CEREMONY_MS : photoJourney ? PHOTO_JOURNEY_MS : escort ? ESCORT_MS : SLIDE_MS;
    const coverMs = umbrella ? UMBRELLA_COVER_MS : dressTransition === 'fireworks' ? DRESS_COVER_MS : dressTransition === 'return' ? DRESS_RETURN_COVER_MS : 0;
    const next = { from: active, to, escort, photoJourney, umbrella, dressTransition, paperScroll, verticalScroll, coverMs, covered: false, eventTransition, skyTravel, duration };
    journeyRef.current = next;
    setJourney(next);
  }, [opened, active, reducedMotion, modules, focusPanel]);

  const moving = Boolean(journey);
  const coveredJourney = Boolean(journey?.coverMs);
  const presented = coveredJourney && journey.covered ? journey.to : active;
  const quoteIndex = modules.findIndex(module => module.type === 'biblical_quote');
  const hasPromenade = modules.some(module => module.type === 'hero_image_1') && quoteIndex >= 0;
  const connectedLandscape = modules[0]?.type === 'hero_image_1' && quoteIndex === 1 && !modules[0].data.backgroundImage;
  // Follow the painting's uniform cover scale on taller phones, not just the
  // viewport grid: its matching last third can begin beyond column two.
  const connectedQuoteX = Math.min(size.width * 2.7, Math.max(size.width * 3, size.height * 1649 / 954) * 2 / 3);
  const hasPhotoJourney = quoteIndex >= 0 && modules[quoteIndex + 1]?.type === 'image_slider_1';
  const dateIndex = modules.findIndex(isDateScene);
  const detailsIndex = modules.findIndex(module => module.type === 'event_details');
  const giftIndex = modules.findIndex(module => module.type === 'gift_envelopes');
  const recommendationIndex = modules.findIndex(module => module.type === 'recommendations');
  const destination = modules[coveredJourney ? presented : journey?.to ?? active];
  const wide = destination?.type === 'event_details';
  const sky = destination?.type === 'gift_envelopes';
  const hotel = destination?.type === 'recommendations' ? destination
    : moving && modules[active]?.type === 'recommendations' ? modules[active] : null;
  const night = sky || destination?.type === 'recommendations';
  const windActive = opened && (wide || (moving && modules[active]?.type === 'event_details')) && !reducedMotion;
  const cell = index => sceneCell(index, modules);
  const gardenIndex = dateIndex >= 0 ? dateIndex : detailsIndex >= 0 ? detailsIndex : giftIndex >= 0 ? giftIndex : recommendationIndex;
  const geometry = gardenGeometry(size.width, size.height, gardenIndex >= 0 ? cell(gardenIndex).column - 1 : 0);
  const pose = index => modules[index]?.type === 'gift_envelopes' ? geometry.sky
    : index === dateIndex || ['event_details', 'recommendations', 'dresscode', 'attendance_confirm', 'closing_message'].includes(modules[index]?.type) ? geometry.wide
    : { x: -size.width * cell(index).column, y: 0, scale: 1 };
  const cameraVars = {
    '--camera-from': cameraTransform(pose(coveredJourney ? presented : active)),
    '--camera-to': cameraTransform(pose(coveredJourney ? presented : journey?.to ?? active)),
    '--journey-duration': `${journey?.duration || SLIDE_MS}ms`,
    '--sky-fade-duration': journey?.skyTravel && !journey.umbrella ? `${SKY_MS}ms` : '0ms',
  };
  const cameraMotion = moving && !coveredJourney && !journey.paperScroll ? journey.photoJourney ? styles.photoJourney : journey.escort ? styles.escorted : styles.sliding : '';
  const paperModules = modules.reduce((parts, module, index) => {
    if (!isPaperScene(module)) return parts;
    const previous = parts[parts.length - 1];
    const vertical = previous && isVerticalPair(previous.module, module);
    return [...parts, { module, index, x: previous ? previous.x + (vertical ? 0 : 1) : 0, y: previous ? previous.y + (vertical ? 1 : 0) : 0 }];
  }, []);
  const paperPosition = (index, axis = 'y') => -100 * (paperModules.find(part => part.index === index)?.[axis] || 0);

  const renderContents = module => [module, ...module.companions].map((part, partIndex) => {
    const View = views[part.type];
    return <div key={`${part.type}-${part.order}`} data-module={partIndex ? part.type : undefined}>
      <ModuleSurface background={part.config?.sectionBackground}>
        <View data={part.data} styles={viewStyles} attendanceState={attendanceState} eventStage={module.eventStage}
          connectedLandscape={connectedLandscape && module === modules[0]}
          sceneActive={opened && modules[active] === module && !moving && !reducedMotion} />
      </ModuleSurface>
    </div>;
  });
  const setPanel = (node, index) => { panelsRef.current[index] = node; if (index === 0 && focusRef) focusRef.current = node; };

  return <div ref={viewportRef} className={styles.viewport} style={cameraVars} tabIndex={opened ? 0 : -1}
    role="region" aria-label="Contenido de la invitación" aria-busy={moving || undefined}
    inert={!opened ? '' : undefined} aria-hidden={!opened || undefined}
    data-scene-index={active} data-scene-moving={moving} data-scene-guide={journey?.escort || undefined}
    data-scene-transition={journey?.paperScroll ? journey.verticalScroll ? 'vertical-scroll' : 'horizontal-scroll' : journey?.umbrella ? 'umbrellas' : journey?.dressTransition || undefined} data-scene-presented={presented}
    data-depth={sky ? 'sky' : wide || destination?.type === 'recommendations' ? 'wide' : 'close'} data-sky-night={night}
    data-event-transition={journey?.eventTransition || undefined}
    onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1); }
      if (event.key === 'ArrowDown' && modules[active]?.type === 'dresscode' && modules[active + 1]?.type === 'attendance_confirm') { event.preventDefault(); goTo(active + 1); }
      if (event.key === 'ArrowUp' && modules[active]?.type === 'attendance_confirm' && modules[active - 1]?.type === 'dresscode') { event.preventDefault(); goTo(active - 1); }
    }}>
    <div data-scene-camera className={`${styles.canvas} ${cameraMotion}`}
      onAnimationEnd={event => { if (event.target === event.currentTarget && !journeyRef.current?.coverMs) finish(); }}>
      {hasPromenade ? <div className={`${styles.scenery} ${connectedLandscape ? styles.connectedScenery : ''}`} aria-hidden="true" data-connected-landscape={connectedLandscape || undefined}>
        <img src={src(connectedLandscape ? connectedPanorama : panorama)} alt="" data-invitation-preload />
      </div> : null}
      {quoteIndex >= 0 ? <div className={`${styles.quoteScenery} ${connectedLandscape ? styles.connectedQuoteScenery : ''}`}
        style={{ left: connectedLandscape ? connectedQuoteX : `${cell(quoteIndex).column * 100}%` }} aria-hidden="true">
        <img src={src(quotePanorama)} alt="" data-invitation-preload />
      </div> : null}
      {modules.map((module, index) => module.type === 'image_slider_1' && !(hasPhotoJourney && index === quoteIndex + 1) ? <div key={`garden-${index}`} className={styles.photoScenery}
        style={{ left: `${cell(index).column * 100 - 20}%` }} aria-hidden="true">
        <img src={src(photoGarden)} alt="" data-invitation-preload />
      </div> : null)}
      {gardenIndex >= 0 ? <div className={styles.gardenWorld} data-garden-world
        style={{ left: geometry.left, top: geometry.top, width: composition.landscape.width, height: composition.landscape.height, transform: `scale(${geometry.scale})` }}>
        <img className={styles.gardenPainting} src={src(gardenPanorama)} alt="" aria-hidden="true" data-invitation-preload data-garden-painting />
        {windActive ? <ChapelWind source={src(gardenPanorama)} className={styles.gardenWindPainting} /> : null}
        {giftIndex >= 0 || recommendationIndex >= 0 ? <div className={styles.gardenNight} data-garden-night aria-hidden="true">
          <img src={src(gardenNightPanorama)} alt="" data-invitation-preload />
          {hotel?.data.imageSrc ? <img className={styles.hotelPainting} src={hotel.data.imageSrc} alt="" data-hotel-painting /> : null}
          <NightStars />
        </div> : null}
      </div> : null}
      {modules.map((module, index) => {
        if (index === dateIndex || ['event_details', 'gift_envelopes', 'recommendations', 'dresscode', 'attendance_confirm', 'closing_message'].includes(module.type)) return null;
        return <section key={`${module.type}-${module.order}-${index}`} data-module={module.type}
          style={{ left: `${cell(index).column * 100}%` }}
          className={`${styles.panel} ${styles[module.type] || ''}`}
          inert={index !== active ? '' : undefined} aria-hidden={index !== active || undefined}>
          <div ref={node => setPanel(node, index)}
            tabIndex={-1} className={styles.moduleContent}>
            {renderContents(module)}
          </div>
        </section>;
      })}
      {quoteIndex >= 0 ? <div className={styles.quoteCanopy}
        style={{ left: `${cell(quoteIndex).column * 100 + 3}%` }} aria-hidden="true" data-quote-canopy>
        <img src={src(quoteCanopy)} alt="" data-invitation-preload />
      </div> : null}
    </div>
    {dateIndex >= 0 ? <section className={styles.dateOverlay} data-module={modules[dateIndex].type}
      data-visible={presented === dateIndex}
      inert={dateIndex !== active || moving ? '' : undefined} aria-hidden={dateIndex !== active || moving || undefined}>
      <div ref={node => setPanel(node, dateIndex)} tabIndex={-1} className={styles.moduleContent}>
        <DateSceneLemoncello>{renderContents(modules[dateIndex])}</DateSceneLemoncello>
      </div>
    </section> : null}
    {modules.map((module, index) => {
      if (module.type !== 'event_details') return null;
      const interactive = index === active && !moving;
      const revealWithLandscape = Boolean(journey?.umbrella && journey.covered && index === presented);
      const visible = interactive || revealWithLandscape;
      return <section key={`event-${module.order}-${module.eventStage || index}`}
        className={`${styles.panel} ${styles.event_details} ${styles.eventOverlay}`}
        data-module="event_details" data-event-stage={module.eventStage} data-visible={visible}
        data-reveal-with-landscape={revealWithLandscape || undefined}
        inert={!interactive ? '' : undefined} aria-hidden={!interactive || undefined}>
        <div ref={node => setPanel(node, index)} tabIndex={-1} className={styles.moduleContent}>
          {renderContents(module)}
        </div>
      </section>;
    })}
    {journey?.eventTransition === 'reception' ? <FireworkTransitionLemoncello /> : null}
    <div className={`${styles.paperStack} ${journey?.paperScroll ? styles.paperScrolling : ''}`} data-paper-stack
      data-visible={isPaperScene(modules[presented])}
      style={{ '--paper-from': `${paperPosition(active)}%`, '--paper-to': `${paperPosition(journey?.to ?? active)}%`, '--paper-from-x': `${paperPosition(active, 'x')}%`, '--paper-to-x': `${paperPosition(journey?.to ?? active, 'x')}%` }}
      onAnimationEnd={event => { if (event.target === event.currentTarget && journeyRef.current?.paperScroll) finish(); }}>
    {paperModules.map(({ module, index, x, y }) => <section key={`paper-${module.order}-${index}`}
      style={{ top: `${y * 100}%`, left: `${x * 100}%` }}
      className={styles.dressOverlay} data-module={module.type} data-visible={index === presented || Boolean(journey?.paperScroll)} data-ready={(index === active && !moving) || Boolean(journey?.paperScroll)}
      inert={index !== active || moving ? '' : undefined} aria-hidden={index !== active || moving || undefined}>
      <div ref={node => setPanel(node, index)} tabIndex={-1} className={styles.moduleContent}>
        {renderContents(module)}
      </div>
    </section>)}
    </div>
    {modules.map((module, index) => module.type === 'recommendations' ? <section key={`recommendations-${module.order}-${index}`}
      className={styles.recommendationsOverlay} data-module="recommendations" data-visible={index === active && !moving}
      inert={index !== active || moving ? '' : undefined} aria-hidden={index !== active || moving || undefined}>
      <div ref={node => setPanel(node, index)} tabIndex={-1} className={styles.moduleContent}>
        {renderContents(module)}
      </div>
    </section> : null)}
    {modules.map((module, index) => module.type === 'gift_envelopes' ? <section key={`gift-${module.order}-${index}`}
      className={styles.giftOverlay} data-module="gift_envelopes" data-visible={index === active && !moving}
      inert={index !== active || moving ? '' : undefined} aria-hidden={index !== active || moving || undefined}>
      <div ref={node => setPanel(node, index)} tabIndex={-1} className={styles.moduleContent}>
        {renderContents(module)}
      </div>
    </section> : null)}
    {hasPromenade ? <div className={`${styles.waiterTrack} ${journey?.escort === 'waiter' ? styles.waiterTravel : ''}`} aria-hidden="true">
      <div className={styles.waiterWindow}>
        <img className={styles.waiterFrames} src={src(waiter)} alt="" data-invitation-preload />
      </div>
    </div> : null}
    {hasPhotoJourney ? <div className={`${styles.birdGuideTrack} ${journey?.escort === 'bird' ? styles.birdGuideTravel : ''}`} aria-hidden="true" data-bird-guide>
      <div className={styles.birdGuideWindow}>
        <img className={styles.birdGuideFrames} src={src(bird)} alt="" data-invitation-preload />
      </div>
    </div> : null}
    {dateIndex >= 0 ? <UmbrellaTransitionLemoncello running={Boolean(journey?.umbrella)}
      width={size.width} height={size.height} onCovered={revealCoveredScene} onComplete={finish} /> : null}
    {journey?.dressTransition ? <DressCodeTransitionLemoncello reverse={journey.dressTransition === 'return'} onComplete={finish} /> : null}
    <nav className={styles.sceneNavigation} aria-label="Recorrido de la invitación">
      {active > 0 ? <button type="button" className={`${styles.sceneArrow} ${styles.previousArrow}`}
        aria-label="Volver a la escena anterior" disabled={!opened || moving} onClick={() => goTo(active - 1)}>
        <img src={src(arrow)} alt="" data-invitation-preload />
      </button> : null}
      {active < modules.length - 1 ? <button type="button" className={`${styles.sceneArrow} ${styles.nextArrow}`}
        aria-label={modules[active + 1]?.type === 'closing_message' ? 'Ver mensaje final' : modules[active + 1]?.type === 'attendance_confirm' ? 'Ir a asistencia' : modules[active + 1]?.type === 'dresscode' ? 'Ver vestuario' : modules[active + 1]?.type === 'recommendations' ? 'Ver recomendaciones' : modules[active + 1]?.type === 'biblical_quote' ? 'Ir a la frase' : modules[active + 1]?.type === 'welcome_message' ? 'Ir al mensaje de bienvenida' : modules[active + 1]?.type === 'image_slider_1' ? 'Ir a las fotos' : isDateScene(modules[active + 1]) ? 'Ir a la cuenta regresiva' : modules[active + 1]?.type === 'gift_envelopes' ? 'Ver lluvia de sobres' : modules[active + 1]?.type === 'event_details' ? modules[active + 1].eventStage === 'reception' ? 'Ver recepción' : 'Ver ceremonia' : 'Ir a la siguiente escena'}
        disabled={!opened || moving} onClick={() => goTo(active + 1)}>
        <img src={src(arrow)} alt="" data-invitation-preload />
      </button> : null}
    </nav>
  </div>;
}
