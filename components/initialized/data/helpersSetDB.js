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

export const actualizarModulosClientePorEvento = async ({ idEvento, modules }) => {
  return await setDB(`/eventos/${idEvento}/modulos-cliente`, {
    modules,
  }, {
    method: 'PUT',
  });
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

export const crearInvitadoEvento = async ({ idEvento, nombre, telefono, whatsapp, parentescoId, grupoEdadId }) => {
  return await setDB(`/eventos/${idEvento}/invitados`, {
    nombre,
    telefono,
    whatsapp,
    parentescoId,
    grupoEdadId,
  });
};

export const actualizarInvitadoEvento = async ({ idEvento, idInvitado, nombre, telefono, whatsapp, parentescoId, grupoEdadId, estadoAsistenciaId }) => {
  return await setDB(`/eventos/${idEvento}/invitados/${idInvitado}`, {
    nombre,
    telefono,
    whatsapp,
    parentescoId,
    grupoEdadId,
    estadoAsistenciaId,
  }, {
    method: 'PUT',
  });
};

export const eliminarInvitadoEvento = async ({ idEvento, idInvitado }) => {
  return await setDB(`/eventos/${idEvento}/invitados/${idInvitado}`, {}, {
    method: 'DELETE',
  });
};

export const crearInvitacionEvento = async ({ idEvento, label, mensajePersonalizado }) => {
  return await setDB(`/eventos/${idEvento}/invitaciones`, {
    label,
    mensajePersonalizado,
  });
};

export const actualizarInvitacionEvento = async ({ idEvento, idInvitacion, label, mensajePersonalizado, enviada }) => {
  return await setDB(`/eventos/${idEvento}/invitaciones/${idInvitacion}`, {
    label,
    mensajePersonalizado,
    enviada,
  }, {
    method: 'PUT',
  });
};

export const asignarInvitadoAInvitacion = async ({ idEvento, idInvitacion, idInvitado, principal = false }) => {
  return await setDB(`/eventos/${idEvento}/invitaciones/${idInvitacion}/invitados`, {
    idInvitado,
    principal,
  });
};

export const quitarInvitadoDeInvitacion = async ({ idEvento, idInvitacion, idInvitado }) => {
  return await setDB(`/eventos/${idEvento}/invitaciones/${idInvitacion}/invitados/${idInvitado}`, {}, {
    method: 'DELETE',
  });
};

export const definirPrincipalInvitacion = async ({ idEvento, idInvitacion, idInvitado }) => {
  return await setDB(`/eventos/${idEvento}/invitaciones/${idInvitacion}/principal/${idInvitado}`, {}, {
    method: 'PUT',
  });
};

export const eliminarInvitacionEvento = async ({ idEvento, idInvitacion }) => {
  return await setDB(`/eventos/${idEvento}/invitaciones/${idInvitacion}`, {}, {
    method: 'DELETE',
  });
};
