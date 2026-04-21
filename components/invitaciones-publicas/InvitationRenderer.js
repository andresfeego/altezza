import HeroImage1Module from './modules/HeroImage1Module';
import SimpleImageModule from './modules/SimpleImageModule';
import BiblicalQuoteModule from './modules/BiblicalQuoteModule';
import CountdownImageModule from './modules/CountdownImageModule';
import ParallaxImageDateModule from './modules/ParallaxImageDateModule';
import DressCodeModule from './modules/DressCodeModule';
import GiftEnvelopesModule from './modules/GiftEnvelopesModule';
import ClosingMessageModule from './modules/ClosingMessageModule';
import WelcomeMessageModule from './modules/WelcomeMessageModule';
import PhotoSliderModule from './modules/PhotoSliderModule';
import MusicPlayerModule from './modules/MusicPlayerModule';
import CountdownModule from './modules/CountdownModule';
import CoupleFamilyModule from './modules/CoupleFamilyModule';
import EventDetailsModule from './modules/EventDetailsModule';
import AttendanceConfirmModule from './modules/AttendanceConfirmModule';
import WeddingClassicTemplate from './templates/wedding-classic';
import WeddingTerracotaTemplate from './templates/wedding-terracota';

function resolveModuleData(module, payload) {
  switch (module.type) {
    case 'hero_image_1':
      return HeroImage1Module({ module, ...payload });
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
