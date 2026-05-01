import HeroImage1ClassicModule from './modules/HeroImage1ClassicModule';
import HeroImage1TerracotaModule from './modules/HeroImage1TerracotaModule';
import HeroImage2ClassicModule from './modules/HeroImage2ClassicModule';
import HeroImage2TerracotaModule from './modules/HeroImage2TerracotaModule';
import EnvelopIntroModule from './modules/EnvelopIntroModule';
import SaveTheDateCalendarModule from './modules/SaveTheDateCalendarModule';
import SimpleImageModule from './modules/SimpleImageModule';
import BiblicalQuoteModule from './modules/BiblicalQuoteModule';
import CountdownImageModule from './modules/CountdownImageModule';
import ParallaxImageDateModule from './modules/ParallaxImageDateModule';
import DressCodeModule from './modules/DressCodeModule';
import GiftEnvelopesModule from './modules/GiftEnvelopesModule';
import ClosingMessageModule from './modules/ClosingMessageModule';
import WelcomeMessageModule from './modules/WelcomeMessageModule';
import PhotoSliderModule from './modules/PhotoSliderModule';
import ImageSliderSepiaModule from './modules/ImageSliderSepiaModule';
import MusicPlayerModule from './modules/MusicPlayerModule';
import CountdownModule from './modules/CountdownModule';
import CoupleFamilyModule from './modules/CoupleFamilyModule';
import EventDetailsModule from './modules/EventDetailsModule';
import AttendanceConfirmModule from './modules/AttendanceConfirmModule';
import WeddingClassicTemplate from './templates/wedding-classic';
import WeddingTerracotaTemplate from './templates/wedding-terracota';

function resolveModuleData(module, payload) {
  switch (module.type) {
    case 'envelop_intro':
      return EnvelopIntroModule({ module, ...payload });
    case 'hero_image_1':
      return payload?.evento?.templateKey === 'wedding_terracota'
        ? HeroImage1TerracotaModule({ module, ...payload })
        : HeroImage1ClassicModule({ module, ...payload });
    case 'hero_image_2':
      return payload?.evento?.templateKey === 'wedding_terracota'
        ? HeroImage2TerracotaModule({ module, ...payload })
        : HeroImage2ClassicModule({ module, ...payload });
    case 'save_the_date_calendar':
      return SaveTheDateCalendarModule({ module, ...payload });
    case 'simple_image':
      return SimpleImageModule({ module, ...payload });
    case 'biblical_quote':
      return BiblicalQuoteModule({ module, ...payload });
    case 'countdown_image':
      return CountdownImageModule({ module, ...payload });
    case 'parallax_image_date':
      return ParallaxImageDateModule({ module, ...payload });
    case 'dresscode':
      return DressCodeModule({ module, ...payload });
    case 'gift_envelopes':
      return GiftEnvelopesModule({ module, ...payload });
    case 'closing_message':
      return ClosingMessageModule({ module, ...payload });
    case 'welcome_message':
      return WelcomeMessageModule({ module, ...payload });
    case 'photo_slider':
      return PhotoSliderModule({ module, ...payload });
    case 'image_slider_sepia':
      return ImageSliderSepiaModule({ module, ...payload });
    case 'music_player':
      return MusicPlayerModule({ module, ...payload });
    case 'countdown':
      return CountdownModule({ module, ...payload });
    case 'couple_family':
      return CoupleFamilyModule({ module, ...payload });
    case 'event_details':
      return EventDetailsModule({ module, ...payload });
    case 'attendance_confirm':
      return AttendanceConfirmModule({ module, ...payload });
    default:
      return null;
  }
}

export default function InvitationRenderer({
  evento,
  invitacion,
  invitadoActual,
  listaInvitados,
  modules,
  attendanceState,
}) {
  const payload = {
    evento,
    invitacion,
    invitadoActual,
    listaInvitados,
  };

  const resolvedModules = (Array.isArray(modules) ? modules : [])
    .filter((module) => module?.enabled !== false)
    .sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0))
    .map((module) => ({
      ...module,
      data: resolveModuleData(module, payload),
    }))
    .filter((module) => module.data);

  const TemplateComponent = evento?.templateKey === 'wedding_terracota'
    ? WeddingTerracotaTemplate
    : WeddingClassicTemplate;

  return (
    <TemplateComponent
      evento={evento}
      invitacion={invitacion}
      invitadoActual={invitadoActual}
      resolvedModules={resolvedModules}
      attendanceState={attendanceState}
    />
  );
}
