export default function buildInvitadosSummary(invitados = []) {
  return {
    total: invitados.length,
    principales: invitados.filter((item) => Boolean(item?.principalInvitacion)).length,
    sinInvitacion: invitados.filter((item) => !item?.idInvitacion).length,
    conWhatsapp: invitados.filter((item) => Boolean(item?.wp)).length,
  };
}
