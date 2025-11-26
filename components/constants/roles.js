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

export function getHomePathByRole(rol) {
  return ROLE_HOME_PATH[rol] || '/';
}
