export default function AttendanceConfirmModule({ module, invitacion, listaInvitados }) {
  const customMessages = module?.config?.customMessages && typeof module.config.customMessages === 'object'
    ? module.config.customMessages
    : {};

  return {
    title: String(module?.config?.title || 'Confirma tu asistencia').trim(),
    helperText: String(module?.config?.helperText || 'Selecciona la respuesta de cada integrante de esta invitacion.').trim(),
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
