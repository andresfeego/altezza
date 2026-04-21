export default function EventDetailsModule({ module, invitacion }) {
  return {
    showCeremony: module?.config?.showCeremony !== false,
    showReception: module?.config?.showReception !== false,
    showHashtag: module?.config?.showHashtag !== false,
    showGiftInfo: module?.config?.showGiftInfo !== false,
    giftLabel: String(module?.config?.giftLabel || 'Lluvia de sobres').trim(),
    backgroundVideo: String(module?.config?.backgroundVideo || '').trim(),
    invitacion,
  };
}
