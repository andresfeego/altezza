import MusicPlayerView from '../../module-views/MusicPlayerView';
import ModuleSurface from '../../ModuleSurface';
import HeroImage2ClassicView from '../../module-views/HeroImage2ClassicView';
import HeroImage1ClassicView from '../../module-views/HeroImage1ClassicView';
import EnvelopIntroClassicView from '../../module-views/EnvelopIntroClassicView';
import templateStyles from './index.module.scss';
import portableStyles from '../../module-views/portable.module.scss';
import { COMMON_MODULE_VIEWS } from '../../registry/commonModuleViews';

const styles = { ...portableStyles, ...templateStyles };

const TEMPLATE_DEBUG = false;

export const MODULE_COMPONENTS = {
  ...COMMON_MODULE_VIEWS,
  envelop_intro: EnvelopIntroClassicView,
  hero_image_1: HeroImage1ClassicView,
  hero_image_2: HeroImage2ClassicView,
};

export default function WeddingClassicTemplate({
  resolvedModules,
  attendanceState,
}) {
  const musicModule = resolvedModules.find((module) => module.type === 'music_player');
  const contentModules = resolvedModules.filter((module) => module.type !== 'music_player');

  return (
    <main className={styles.page}>
      {musicModule ? (
        <ModuleSurface background={musicModule.config?.sectionBackground}>
          <MusicPlayerView data={musicModule.data} styles={styles} />
        </ModuleSurface>
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
                <ModuleSurface background={module.config?.sectionBackground}>
                  <ModuleView
                    data={module.data}
                    styles={styles}
                    attendanceState={module.type === 'attendance_confirm' ? attendanceState : undefined}
                  />
                </ModuleSurface>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
