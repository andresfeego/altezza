export default function WelcomeMessageModule({ module, invitacion, invitadoActual }) {
  const title = String(module?.config?.title ?? invitacion?.nombreEvento ?? '').trim();
  const subtitle = String(module?.config?.subtitle || '').trim();
  const personalizedMessage = String(invitacion?.mensajePersonalizado || invitacion?.mensaje_personalizado || '').trim();

  return {
    title,
    subtitle,
    personalizedMessage,
    inviteeName: invitadoActual?.nombre || '',
  };
}
