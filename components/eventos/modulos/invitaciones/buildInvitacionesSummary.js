export default function buildInvitacionesSummary(invitaciones = [], invitados = []) {
  const integrantesAgrupados = invitaciones.flatMap((item) => (
    Array.isArray(item?.listaInvitados) ? item.listaInvitados : []
  ));
  const idsAgrupados = new Set(
    integrantesAgrupados
      .map((item) => item?.id)
      .filter(Boolean)
      .map((value) => String(value))
  );
  const total = invitaciones.length;
  const conIntegrantes = invitaciones.filter((item) => Array.isArray(item?.listaInvitados) && item.listaInvitados.length > 0).length;
  const sinIntegrantes = invitaciones.filter((item) => !Array.isArray(item?.listaInvitados) || item.listaInvitados.length === 0).length;
  const pendientesAgrupar = invitados.filter((item) => {
    if (item?.idInvitacion) return false;
    if (item?.id && idsAgrupados.has(String(item.id))) return false;
    return true;
  }).length;
  const sinConfirmar = integrantesAgrupados.filter((item) => Number(item?.confirmado || 0) <= 0).length;
  const asistire = integrantesAgrupados.filter((item) => Number(item?.confirmado) === 1).length;
  const quiza = integrantesAgrupados.filter((item) => Number(item?.confirmado) === 2).length;
  const noAsistire = integrantesAgrupados.filter((item) => Number(item?.confirmado) === 3).length;

  return {
    total,
    conIntegrantes,
    sinIntegrantes,
    pendientesAgrupar,
    sinConfirmar,
    asistire,
    quiza,
    noAsistire,
  };
}
