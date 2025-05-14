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
