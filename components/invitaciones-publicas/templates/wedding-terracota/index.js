import HeroImage1View from '../../module-views/HeroImage1View';
import SimpleImageView from '../../module-views/SimpleImageView';
import BiblicalQuoteView from '../../module-views/BiblicalQuoteView';
import CountdownImageView from '../../module-views/CountdownImageView';
import ParallaxImageDateView from '../../module-views/ParallaxImageDateView';
import DressCodeView from '../../module-views/DressCodeView';
import GiftEnvelopesView from '../../module-views/GiftEnvelopesView';
import ClosingMessageView from '../../module-views/ClosingMessageView';
import WelcomeMessageView from '../../module-views/WelcomeMessageView';
import MusicPlayerView from '../../module-views/MusicPlayerView';
import PhotoSliderView from '../../module-views/PhotoSliderView';
import CountdownView from '../../module-views/CountdownView';
import CoupleFamilyView from '../../module-views/CoupleFamilyView';
import EventDetailsView from '../../module-views/EventDetailsView';
import AttendanceConfirmView from '../../module-views/AttendanceConfirmView';
import styles from './index.module.scss';

const TEMPLATE_DEBUG = false;

const MODULE_COMPONENTS = {
  hero_image_1: HeroImage1View,
  simple_image: SimpleImageView,
  biblical_quote: BiblicalQuoteView,
  countdown_image: CountdownImageView,
  parallax_image_date: ParallaxImageDateView,
  dresscode: DressCodeView,
  gift_envelopes: GiftEnvelopesView,
  closing_message: ClosingMessageView,
  welcome_message: WelcomeMessageView,
  music_player: MusicPlayerView,
  photo_slider: PhotoSliderView,
  countdown: CountdownView,
  couple_family: CoupleFamilyView,
  event_details: EventDetailsView,
  attendance_confirm: AttendanceConfirmView,
};

export default function WeddingTerracotaTemplate({
  resolvedModules,
  attendanceState,
}) {
  const musicModule = resolvedModules.find((module) => module.type === 'music_player');
  const contentModules = resolvedModules.filter((module) => module.type !== 'music_player');

  return (
    <main className={styles.page}>
      {musicModule ? (
        <MusicPlayerView
          data={musicModule.data}
          styles={styles}
        />
      ) : null}
      <div className={styles.shell}>
        <div className={styles.heroModules}>
          {contentModules.map((module) => {
            const ModuleView = MODULE_COMPONENTS[module.type];
            if (!ModuleView) return null;

            return (
              <div
                key={`${module.type}-${module.order || 0}`}
                className={`${styles.flowBlock} ${styles[`moduleBlock${module.type}`] || ''} ${TEMPLATE_DEBUG ? styles.flowBlockDebug : ''}`}
              >
                {TEMPLATE_DEBUG ? <span className={styles.debugModuleLabel}>{module.type}</span> : null}
                <ModuleView
                  data={module.data}
                  styles={styles}
                  attendanceState={module.type === 'attendance_confirm' ? attendanceState : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
