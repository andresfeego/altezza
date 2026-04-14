import { getDB } from './GetDB';

export async function loginUsuario(correo, pass) {
  return await getDB('/usuario/loginUsuario', {
    method: 'POST',
    body: { correo, pass }
  });
}


export async function getEventosActivos() {
  return await getDB('/eventos/activos', { method: 'GET' });
}

export async function getEventosInactivos() {
  return await getDB('/eventos/inactivos', { method: 'GET' });
}

export async function getResumenEventoById(id) {
  return await getDB('/resumenEvento/' + id, { method: 'GET' });
}

export async function getModulosClientePorEvento(idEvento) {
  return await getDB(`/eventos/${idEvento}/modulos-cliente`, { method: 'GET' });
}

export const getDetalleEvento = async (idEvento) => {
  try {
    return await getDB(`/eventos/detalle_completo/${idEvento}`, { method: 'GET' });
  } catch (error) {
    console.error('Error en getDetalleEvento:', error);
    return null;
  }
};

export async function getTiposEvento() {
  return await getDB('/tiposEvento', { method: 'GET' });
}

export async function getLugares() {
  return await getDB('/lugares', { method: 'GET' });
}

export async function getUsuariosSistema() {
  return await getDB('/usuariosSistema', { method: 'GET' });
}

export async function getRolesSistema() {
  return await getDB('/rolesSistema', { method: 'GET' });
}

export async function getParentescos() {
  return await getDB('/parentescos', { method: 'GET' });
}

export async function getGruposEdad() {
  return await getDB('/gruposEdad', { method: 'GET' });
}

export async function getInvitadosEvento(idEvento) {
  return await getDB(`/eventos/${idEvento}/invitados`, { method: 'GET' });
}

export async function getInvitacionesEvento(idEvento) {
  return await getDB(`/eventos/${idEvento}/invitaciones`, { method: 'GET' });
}

export async function getInvitacionDetalle(idInvitacion) {
  return await getDB('/eventoXinvitacion', {
    method: 'POST',
    body: { idInvitacion },
  });
}

export async function getUsuarioSesion(idUsuario) {
  return await getDB(`/usuariosSistema/${idUsuario}/sesion`, { method: 'GET' });
}
