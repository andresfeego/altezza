import { setDB } from '@/components/initialized/data/SetDB';

export const uploadImagenEvento = async (file, idEvento, modulo = 'datos_evento') => {
  try {
    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('codigoEvento', idEvento);
    formData.append('modulo', modulo);

    const res = await setDB('/uploadImagenEvento', formData);
    return res?.url || null; // debe ser la URL del archivo en el servidor
  } catch (err) {
    console.error('Error al subir imagen del evento:', err);
    return null;
  }
};

export const crearEventoBasico = async ({ id, nombre, idTipoEvento, fechaHoraRecepcion, idLugarRecepcion }) => {
  try {
    return await setDB('/crearEvento', {
      id,
      nombre,
      idTipoEvento,
      fechaHoraRecepcion,
      idLugarRecepcion
    }, 'POST');
  } catch (err) {
    console.error('Error al crear evento:', err);
    return null;
  }
};

export const crearUsuarioSistema = async ({ nombres, apellidos, user, rol, telefon }) => {
  return await setDB('/usuariosSistema', {
    nombres,
    apellidos,
    user,
    rol,
    telefon,
  });
};

export const asignarUsuarioAEvento = async ({ idUsuario, idEvento }) => {
  return await setDB('/usuariosSistema/asignarEvento', {
    idUsuario,
    idEvento,
  });
};

export const quitarUsuarioDeEvento = async ({ idUsuario, idEvento }) => {
  return await setDB('/usuariosSistema/quitarEvento', {
    idUsuario,
    idEvento,
  });
};

export const cambiarPasswordTemporal = async ({ user, passActual, passNueva }) => {
  return await setDB('/usuario/cambiarPasswordTemporal', {
    user,
    passActual,
    passNueva,
  });
};

export const actualizarUsuarioSistema = async ({ idUsuario, nombres, apellidos, user, rol, telefon, estado }) => {
  return await setDB(`/usuariosSistema/${idUsuario}`, {
    nombres,
    apellidos,
    user,
    rol,
    telefon,
    estado,
  }, {
    method: 'PUT',
  });
};

export const regenerarPassTempUsuario = async ({ idUsuario }) => {
  return await setDB(`/usuariosSistema/${idUsuario}/regenerarPassTemp`, {});
};
