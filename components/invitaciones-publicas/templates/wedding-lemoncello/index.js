import { useCallback, useMemo, useRef, useState } from 'react';
import { COMMON_MODULE_VIEWS } from '../../registry/commonModuleViews';
import HeroImage2ClassicView from '../../module-views/HeroImage2ClassicView';
import MusicPlayerView from '../../module-views/MusicPlayerView';
import ModuleSurface from '../../ModuleSurface';
import portableStyles from '../../module-views/portable.module.scss';
import EnvelopeLemoncello from './EnvelopeLemoncello';
import HeroLemoncello from './HeroLemoncello';
import WelcomeLemoncello from './WelcomeLemoncello';
import SceneCanvas from './SceneCanvas';
import templateStyles from './index.module.scss';

const styles = { ...portableStyles, ...templateStyles };

function Quote({ data }) {
  return <div className={styles.basicContent}>
    <h2>Frase bíblica</h2>
    {data.passageText ? <p className={styles.biblicalQuoteText}>{data.passageText}</p> : null}
    {data.passageReference ? <p className={styles.biblicalQuoteReference}>{data.passageReference}</p> : null}
  </div>;
}

export const MODULE_COMPONENTS = {
  ...COMMON_MODULE_VIEWS,
  envelop_intro: EnvelopeLemoncello,
  hero_image_1: HeroLemoncello,
  welcome_message: WelcomeLemoncello,
  hero_image_2: HeroImage2ClassicView,
  biblical_quote: Quote,
};

export default function WeddingLemoncelloTemplate({ resolvedModules = [], attendanceState, presentationReady = true }) {
  const envelope = resolvedModules.find((module) => module.type === 'envelop_intro');
  const music = resolvedModules.find((module) => module.type === 'music_player');
  const modules = useMemo(() => resolvedModules.filter((module) => !['envelop_intro', 'music_player'].includes(module.type) && MODULE_COMPONENTS[module.type]), [resolvedModules]);
  const [opened, setOpened] = useState(!envelope);
  const focusRef = useRef(null);
  const open = useCallback(() => {
    setOpened(true);
    requestAnimationFrame(() => focusRef.current?.focus({ preventScroll: true }));
  }, []);

  return <main className={styles.page}>
    {music ? <ModuleSurface background={music.config?.sectionBackground}><MusicPlayerView data={music.data} styles={styles} /></ModuleSurface> : null}
    <div className={styles.shell}>
      <SceneCanvas modules={modules} views={MODULE_COMPONENTS} viewStyles={styles} attendanceState={attendanceState} opened={opened || !envelope} focusRef={focusRef} />
      {envelope && !opened ? <ModuleSurface background={envelope.config?.sectionBackground}>
        <EnvelopeLemoncello data={envelope.data} onOpen={open} presentationReady={presentationReady} />
      </ModuleSurface> : null}
    </div>
  </main>;
}
