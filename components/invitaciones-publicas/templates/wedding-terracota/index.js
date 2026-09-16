import MusicPlayerView from '../../module-views/MusicPlayerView';
import { useEffect, useRef } from 'react';
import HeroImage1TerracotaView from '../../module-views/HeroImage1TerracotaView';
import HeroImage2TerracotaView from '../../module-views/HeroImage2TerracotaView';
import EnvelopIntroTerracotaView from '../../module-views/EnvelopIntroTerracotaView';
import templateStyles from './index.module.scss';
import portableStyles from '../../module-views/portable.module.scss';
import { COMMON_MODULE_VIEWS } from '../../registry/commonModuleViews';

const styles = { ...portableStyles, ...templateStyles };

const TEMPLATE_DEBUG = false;

export const MODULE_COMPONENTS = {
  ...COMMON_MODULE_VIEWS,
  envelop_intro: EnvelopIntroTerracotaView,
  hero_image_1: HeroImage1TerracotaView,
  hero_image_2: HeroImage2TerracotaView,
};

export default function WeddingTerracotaTemplate({
  resolvedModules,
  attendanceState,
}) {
  const rootRef = useRef(null);
  const musicModule = resolvedModules.find((module) => module.type === 'music_player');
  const contentModules = resolvedModules.filter((module) => module.type !== 'music_player');

  useEffect(() => {
    if (typeof window === 'undefined' || !rootRef.current) return;

    const accentMap = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      Á: 'A',
      É: 'E',
      Í: 'I',
      Ó: 'O',
      Ú: 'U',
    };

    const isSecondaryFontElement = (element) => {
      const fontFamily = window.getComputedStyle(element).fontFamily || '';
      return fontFamily.includes('Silvertone');
    };

    const replaceAccentsInNode = (textNode) => {
      const value = textNode.nodeValue || '';
      if (!/[áéíóúÁÉÍÓÚ]/.test(value)) return;

      const wrapper = textNode.parentElement;
      if (!wrapper || !isSecondaryFontElement(wrapper)) return;

      const fragment = document.createDocumentFragment();
      let changed = false;

      for (const char of value) {
        const baseChar = accentMap[char];
        if (!baseChar) {
          fragment.appendChild(document.createTextNode(char));
          continue;
        }

        changed = true;
        const accentSpan = document.createElement('span');
        accentSpan.className = styles.secondaryAccentChar;
        accentSpan.textContent = baseChar;
        fragment.appendChild(accentSpan);
      }

      if (changed) {
        textNode.replaceWith(fragment);
      }
    };

    const walker = document.createTreeWalker(rootRef.current, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let currentNode = walker.nextNode();
    while (currentNode) {
      textNodes.push(currentNode);
      currentNode = walker.nextNode();
    }

    textNodes.forEach(replaceAccentsInNode);
  }, [resolvedModules]);

  return (
    <main ref={rootRef} className={styles.page}>
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
