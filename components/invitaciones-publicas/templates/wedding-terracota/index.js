import { useEffect, useRef } from 'react';
import HeroImage1TerracotaView from '../../module-views/HeroImage1TerracotaView';
import HeroImage2TerracotaView from '../../module-views/HeroImage2TerracotaView';
import EnvelopIntroTerracotaView from '../../module-views/EnvelopIntroTerracotaView';
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
import ImageSliderSepiaView from '../../module-views/ImageSliderSepiaView';
import CountdownView from '../../module-views/CountdownView';
import CoupleFamilyView from '../../module-views/CoupleFamilyView';
import SaveTheDateCalendarView from '../../module-views/SaveTheDateCalendarView';
import EventDetailsView from '../../module-views/EventDetailsView';
import AttendanceConfirmView from '../../module-views/AttendanceConfirmView';
import styles from './index.module.scss';

const TEMPLATE_DEBUG = false;

const MODULE_COMPONENTS = {
  envelop_intro: EnvelopIntroTerracotaView,
  hero_image_1: HeroImage1TerracotaView,
  hero_image_2: HeroImage2TerracotaView,
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
  image_slider_sepia: ImageSliderSepiaView,
  countdown: CountdownView,
  couple_family: CoupleFamilyView,
  save_the_date_calendar: SaveTheDateCalendarView,
  event_details: EventDetailsView,
  attendance_confirm: AttendanceConfirmView,
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
