import EnvelopIntroModule from '../modules/EnvelopIntroModule';
import SaveTheDateCalendarModule from '../modules/SaveTheDateCalendarModule';
import SimpleImageModule from '../modules/SimpleImageModule';
import BiblicalQuoteModule from '../modules/BiblicalQuoteModule';
import CountdownImageModule from '../modules/CountdownImageModule';
import ParallaxImageDateModule from '../modules/ParallaxImageDateModule';
import DressCodeModule from '../modules/DressCodeModule';
import GiftEnvelopesModule from '../modules/GiftEnvelopesModule';
import ClosingMessageModule from '../modules/ClosingMessageModule';
import WelcomeMessageModule from '../modules/WelcomeMessageModule';
import PhotoSliderModule from '../modules/PhotoSliderModule';
import ImageSliderSepiaModule from '../modules/ImageSliderSepiaModule';
import MusicPlayerModule from '../modules/MusicPlayerModule';
import CountdownModule from '../modules/CountdownModule';
import CoupleFamilyModule from '../modules/CoupleFamilyModule';
import EventDetailsModule from '../modules/EventDetailsModule';
import AttendanceConfirmModule from '../modules/AttendanceConfirmModule';
import HeroImage1ClassicModule from '../modules/HeroImage1ClassicModule';
import HeroImage1TerracotaModule from '../modules/HeroImage1TerracotaModule';
import HeroImage2ClassicModule from '../modules/HeroImage2ClassicModule';
import HeroImage2TerracotaModule from '../modules/HeroImage2TerracotaModule';
import { normalizeTemplateKey } from './templateKey';

const COMMON_RESOLVERS = {
  envelop_intro: EnvelopIntroModule,
  save_the_date_calendar: SaveTheDateCalendarModule,
  simple_image: SimpleImageModule,
  biblical_quote: BiblicalQuoteModule,
  countdown_image: CountdownImageModule,
  parallax_image_date: ParallaxImageDateModule,
  dresscode: DressCodeModule,
  gift_envelopes: GiftEnvelopesModule,
  closing_message: ClosingMessageModule,
  welcome_message: WelcomeMessageModule,
  photo_slider: PhotoSliderModule,
  image_slider_sepia: ImageSliderSepiaModule,
  music_player: MusicPlayerModule,
  countdown: CountdownModule,
  couple_family: CoupleFamilyModule,
  event_details: EventDetailsModule,
  attendance_confirm: AttendanceConfirmModule,
};

const TEMPLATE_RESOLVER_OVERRIDES = {
  wedding_classic: {
    hero_image_1: HeroImage1ClassicModule,
    hero_image_2: HeroImage2ClassicModule,
  },
  wedding_terracota: {
    hero_image_1: HeroImage1TerracotaModule,
    hero_image_2: HeroImage2TerracotaModule,
  },
};

export function resolveModuleDataByTemplate(module, payload, templateKey) {
  const type = String(module?.type || '').trim();
  if (!type) return null;

  const normalizedKey = normalizeTemplateKey(templateKey);
  const templateResolvers = TEMPLATE_RESOLVER_OVERRIDES[normalizedKey] || {};
  const resolver = templateResolvers[type] || COMMON_RESOLVERS[type];

  if (typeof resolver !== 'function') return null;
  return resolver({ module, ...payload });
}

export function buildResolvedModules(modules, payload, templateKey) {
  return (Array.isArray(modules) ? modules : [])
    .filter((module) => module?.enabled !== false)
    .sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0))
    .map((module) => ({
      ...module,
      data: resolveModuleDataByTemplate(module, payload, templateKey),
    }))
    .filter((module) => module.data);
}
