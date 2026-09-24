import { useCallback, useMemo, useRef, useState } from 'react';
import { COMMON_MODULE_VIEWS } from '../../registry/commonModuleViews';
import HeroImage2ClassicView from '../../module-views/HeroImage2ClassicView';
import MusicPlayerView from '../../module-views/MusicPlayerView';
import ModuleSurface from '../../ModuleSurface';
import portableStyles from '../../module-views/portable.module.scss';
import EnvelopeLemoncello from './EnvelopeLemoncello';
import HeroLemoncello from './HeroLemoncello';
import WelcomeLemoncello from './WelcomeLemoncello';
import QuoteLemoncello from './QuoteLemoncello';
import PhotoStackLemoncello from './PhotoStackLemoncello';
import SceneCanvas from './SceneCanvas';
import { CountdownLemoncello, CalendarLemoncello } from './DateSceneLemoncello';
import EventDetailsLemoncello from './EventDetailsLemoncello';
import GiftEnvelopesLemoncello from './GiftEnvelopesLemoncello';
import RecommendationsLemoncello from './RecommendationsLemoncello';
import DressCodeLemoncello from './DressCodeLemoncello';
import AttendanceLemoncello from './AttendanceLemoncello';
import ClosingLemoncello from './ClosingLemoncello';
import templateStyles from './index.module.scss';

const styles = { ...portableStyles, ...templateStyles };

export const MODULE_COMPONENTS = {
  ...COMMON_MODULE_VIEWS,
  envelop_intro: EnvelopeLemoncello,
  hero_image_1: HeroLemoncello,
  welcome_message: WelcomeLemoncello,
  image_slider_1: PhotoStackLemoncello,
  hero_image_2: HeroImage2ClassicView,
  biblical_quote: QuoteLemoncello,
  countdown: CountdownLemoncello,
  save_the_date_calendar: CalendarLemoncello,
  event_details: EventDetailsLemoncello,
  gift_envelopes: GiftEnvelopesLemoncello,
  recommendations: RecommendationsLemoncello,
  dresscode: DressCodeLemoncello,
  attendance_confirm: AttendanceLemoncello,
  closing_message: ClosingLemoncello,
};

export default function WeddingLemoncelloTemplate({ resolvedModules = [], attendanceState, presentationReady = true }) {
  const envelope = resolvedModules.find((module) => module.type === 'envelop_intro');
  const music = resolvedModules.find((module) => module.type === 'music_player');
  const modules = useMemo(() => resolvedModules.filter((module) => !['envelop_intro', 'music_player'].includes(module.type) && MODULE_COMPONENTS[module.type]), [resolvedModules]);
  const [opened, setOpened] = useState(!envelope);
  const [introStarted, setIntroStarted] = useState(!envelope);
  const focusRef = useRef(null);
  const open = useCallback(() => {
    setOpened(true);
    requestAnimationFrame(() => focusRef.current?.focus({ preventScroll: true }));
  }, []);

  return <main className={styles.page}>
    {music ? <div hidden={!introStarted}><ModuleSurface background={music.config?.sectionBackground}><MusicPlayerView data={music.data} styles={styles} playbackReady={presentationReady} waitForStart={Boolean(envelope)} /></ModuleSurface></div> : null}
    <div className={styles.shell}>
      <SceneCanvas modules={modules} views={MODULE_COMPONENTS} viewStyles={styles} attendanceState={attendanceState} opened={opened || !envelope} focusRef={focusRef} />
      {envelope && !opened ? <ModuleSurface background={envelope.config?.sectionBackground}>
        <EnvelopeLemoncello data={envelope.data} onStart={() => setIntroStarted(true)} onOpen={open} presentationReady={presentationReady} />
      </ModuleSurface> : null}
    </div>
  </main>;
}
