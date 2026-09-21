export default function EventDetailsModule({ module, invitacion }) {
  return {
    title: String(module?.config?.title || '').trim(),
    showCeremony: module?.config?.showCeremony !== false,
    showReception: module?.config?.showReception !== false,
    showHashtag: module?.config?.showHashtag !== false,
    showGiftInfo: module?.config?.showGiftInfo !== false,
    giftLabel: String(module?.config?.giftLabel || '').trim(),
    backgroundVideo: String(module?.config?.backgroundVideo || '').trim(),
    ceremonyMessage: String(module?.config?.ceremonyMessage || '').trim(),
    receptionMessage: String(module?.config?.receptionMessage || '').trim(),
    ceremonyAddress: String(invitacion?.ceremonyAddress || module?.config?.ceremonyAddress || '').trim(),
    receptionAddress: String(invitacion?.receptionAddress || module?.config?.receptionAddress || '').trim(),
    ceremonyMapUrl: String(invitacion?.ceremonyMapUrl || module?.config?.ceremonyMapUrl || '').trim(),
    receptionMapUrl: String(invitacion?.receptionMapUrl || module?.config?.receptionMapUrl || '').trim(),
    invitacion,
  };
}
