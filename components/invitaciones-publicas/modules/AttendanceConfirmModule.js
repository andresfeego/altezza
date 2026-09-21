export default function AttendanceConfirmModule({ module, invitacion, listaInvitados }) {
  const customMessages = module?.config?.customMessages && typeof module.config.customMessages === 'object'
    ? module.config.customMessages
    : {};

  return {
    title: String(module?.config?.title || '').trim(),
    helperText: String(module?.config?.helperText || '').trim(),
    personalizedMessage: String(
      invitacion?.mensaje_personalizado
      || invitacion?.mensajePersonalizado
      || ''
    ).trim(),
    deadlineMode: String(module?.config?.deadlineMode || 'fechaHoraLimiteConfirmar').trim(),
    deadline: invitacion?.fechaHoraLimiteConfirmar || null,
    useCustomMessages: Boolean(module?.config?.useCustomMessages),
    customMessages: {
      attending: String(customMessages?.attending || '').trim(),
      maybe: String(customMessages?.maybe || '').trim(),
      decline: String(customMessages?.decline || '').trim(),
    },
    guests: Array.isArray(listaInvitados) ? listaInvitados : [],
  };
}
