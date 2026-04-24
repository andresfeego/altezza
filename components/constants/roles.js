export const ROLE_IDS = {
  ADMIN_WEDDING: 1,
  CLIENTE: 2,
  ORGANIZADOR: 3,
  COLABORADOR: 4,
};

export const ROLE_HOME_PATH = {
  [ROLE_IDS.ADMIN_WEDDING]: '/home/admin',
  [ROLE_IDS.CLIENTE]: '/home/cliente',
  [ROLE_IDS.ORGANIZADOR]: '/home/organizador',
  [ROLE_IDS.COLABORADOR]: '/home/colaborador',
};

export function getRoleHomePath(rol) {
  return ROLE_HOME_PATH[rol] || '/';
}

export function getHomePathByRole(rol) {
  return getRoleHomePath(rol);
}

export function getDefaultPathByUser(user) {
  const rol = user?.rol;

  if (rol === ROLE_IDS.CLIENTE) {
    const eventosAsignados = Array.isArray(user?.eventosAsignados)
      ? user.eventosAsignados.filter((evento) => evento && (evento.id || typeof evento === 'string'))
      : [];

    if (eventosAsignados.length === 1) {
      const singleEvent = eventosAsignados[0];
      const eventId = typeof singleEvent === 'string' ? singleEvent : singleEvent.id;
      return `/evento/feed/${eventId}`;
    }

    return '/home/cliente';
  }

  return getRoleHomePath(rol);
}

export function getLoginErrorMessage(errorCode) {
  switch (errorCode) {
    case 401:
      return 'La contraseña es incorrecta.';
    case 404:
      return 'Verifica las credenciales ingresadas.';
    case 406:
      return 'El usuario no tiene una contraseña asignada.';
    case 409:
      return 'Debes actualizar la contraseña temporal antes de continuar.';
    default:
      return 'Hubo un error. Intenta de nuevo.';
  }
}
