export default function HeroImage1OlivaModule({ module, evento, invitacion }) {
  return {
    brideName: String(module?.config?.brideName || '').trim(),
    groomName: String(module?.config?.groomName || '').trim(),
    coupleNames: String(evento?.nombre || invitacion?.nombreEvento || '').trim(),
    message: String(module?.config?.message || '').trim(),
    imageSrc: String(module?.config?.imageSrc || '').trim(),
    imageAlt: String(module?.config?.imageAlt || evento?.nombre || '').trim(),
    date: invitacion?.fechaHoraCeremonia || null,
  };
}
