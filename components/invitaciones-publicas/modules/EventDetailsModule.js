export default function EventDetailsModule({ module, invitacion }) {
  return {
    showCeremony: module?.config?.showCeremony !== false,
    showReception: module?.config?.showReception !== false,
    showHashtag: module?.config?.showHashtag !== false,
    showGiftInfo: module?.config?.showGiftInfo !== false,
    giftLabel: String(module?.config?.giftLabel || 'Lluvia de sobres').trim(),
    backgroundVideo: String(module?.config?.backgroundVideo || '').trim(),
    ceremonyMessage: String(module?.config?.ceremonyMessage || '').trim(),
    receptionMessage: String(module?.config?.receptionMessage || '').trim(),
    ceremonyAddress: String(module?.config?.ceremonyAddress || '').trim(),
    receptionAddress: String(module?.config?.receptionAddress || '').trim(),
    ceremonyMapUrl: String(module?.config?.ceremonyMapUrl || '').trim(),
    receptionMapUrl: String(module?.config?.receptionMapUrl || '').trim(),
    invitacion,
  };
}
