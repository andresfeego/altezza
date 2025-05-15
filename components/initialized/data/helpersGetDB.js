import { getDB } from './GetDB';

export async function loginUsuario(correo, pass) {
  return await getDB('/usuario/loginUsuario', {
    method: 'POST',
    body: { correo, pass }
  });
}

export async function loginSocial(correo) {
  return await getDB('/usuario/loginSocial', {
    method: 'POST',
    body: { correo }
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