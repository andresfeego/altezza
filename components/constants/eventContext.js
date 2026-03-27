import { ROLE_IDS } from '@/components/constants/roles';
import { getClientModuleByPathname, isClientModuleEnabled } from '@/components/constants/clientModules';

const CLIENTE_EVENT_ROUTE_PREFIXES = [
  '/evento/',
];

export function getAssignedEventId(user) {
  const onlyEvent = getSingleAssignedEvent(user);
  if (onlyEvent?.id) return String(onlyEvent.id);
  return user?.idEventoAsignado ? String(user.idEventoAsignado) : null;
}

export function getAssignedEvents(user) {
  if (Array.isArray(user?.eventosAsignados)) {
    return user.eventosAsignados
      .filter(Boolean)
      .map((evento) => (typeof evento === 'string' ? { id: evento } : evento))
      .filter((evento) => evento?.id);
  }

  if (user?.idEventoAsignado) {
    return [{ id: String(user.idEventoAsignado) }];
  }

  return [];
}

export function getAssignedEventCount(user) {
  return getAssignedEvents(user).length;
}

export function getSingleAssignedEvent(user) {
  const eventos = getAssignedEvents(user);
  return eventos.length === 1 ? eventos[0] : null;
}

export function hasAssignedEvent(user) {
  return getAssignedEventCount(user) > 0;
}

export function isClienteRole(user) {
  return user?.rol === ROLE_IDS.CLIENTE;
}

export function isClienteHomeRoute(pathname = '') {
  return pathname === '/home/cliente';
}

export function isClienteEventRoute(pathname = '') {
  return CLIENTE_EVENT_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function canAccessClientRoute({
  pathname = '',
  user,
  activeEventId = null,
  moduleState = {},
  hasResolvedModules = false,
}) {
  const isCliente = isClienteRole(user);

  if (!isCliente) {
    return { allowed: true, reason: 'not_cliente' };
  }

  if (isClienteHomeRoute(pathname)) {
    return { allowed: true, reason: 'cliente_home' };
  }

  if (!isClienteEventRoute(pathname)) {
    return { allowed: true, reason: 'outside_cliente_event_scope' };
  }

  if (!hasAssignedEvent(user)) {
    return { allowed: false, reason: 'missing_event' };
  }

  if (!activeEventId) {
    return { allowed: false, reason: 'missing_active_event' };
  }

  const matchedModule = getClientModuleByPathname(pathname);
  if (!matchedModule) {
    return { allowed: false, reason: 'unknown_module' };
  }

  if (!hasResolvedModules) {
    return { allowed: true, reason: 'modules_pending' };
  }

  if (!isClientModuleEnabled(matchedModule.key, moduleState)) {
    return { allowed: false, reason: 'module_disabled', moduleKey: matchedModule.key };
  }

  return { allowed: true, reason: 'module_enabled', moduleKey: matchedModule.key };
}
