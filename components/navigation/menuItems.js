import { ROLE_IDS } from '@/components/constants/roles';
import { FiHome } from 'react-icons/fi';
import { LuUserRoundCog, LuPartyPopper } from 'react-icons/lu';
import { GiWoodenChair } from 'react-icons/gi';
import { TbAlphabetLatin, TbTruckLoading } from 'react-icons/tb';
import { MdOutlinePriceChange } from 'react-icons/md';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import { getAssignedEventCount, getSingleAssignedEvent } from '@/components/constants/eventContext';
import useEventoStore from '@/components/initialized/stored/useEventoStore';
import {
  CLIENT_HOME_MENU_ITEM,
  getEnabledClientModules,
} from '@/components/constants/clientModules';

export const baseItems = {
  [ROLE_IDS.ADMIN_WEDDING]: [
    { id: 'home', label: 'Home', icon: <FiHome />, url: '/home/admin' },
    { id: 'usuarios', label: 'Usuarios', icon: <LuUserRoundCog />, url: '/admin/usuarios' },
    { id: 'eventos', label: 'Eventos', icon: <LuPartyPopper />, url: '/admin/eventos' },
    { id: 'mobiliario', label: 'Mobiliario', icon: <GiWoodenChair />, url: '/admin/mobiliario' },
    { id: 'alquiler', label: 'Alquiler', icon: <TbTruckLoading />, url: '/admin/alquiler' },
    { id: 'cotizador', label: 'Cotizador', icon: <MdOutlinePriceChange />, url: '/admin/cotizador' },
    { id: 'frases', label: 'Frases', icon: <TbAlphabetLatin />, url: '/admin/frases' },
  ],
  [ROLE_IDS.CLIENTE]: [],
  [ROLE_IDS.ORGANIZADOR]: [
    { id: 'organizador', label: 'Organizador', icon: <FiHome />, url: '/home/organizador' },
  ],
  [ROLE_IDS.COLABORADOR]: [
    { id: 'colaborador', label: 'Colaborador', icon: <FiHome />, url: '/home/colaborador' },
  ],
};

export function getMenuItemsByRole(rol) {
  const state = typeof useUsuarioStore.getState === 'function' ? useUsuarioStore.getState() : {};
  const eventoState = typeof useEventoStore.getState === 'function' ? useEventoStore.getState() : {};
  const dataUsuario = state?.dataUsuario;
  const storeRol = dataUsuario?.rol;
  const totalEventosAsignados = getAssignedEventCount(dataUsuario);
  const singleAssignedEvent = getSingleAssignedEvent(dataUsuario);
  const idEventoActivo = eventoState?.idEventoActivo || singleAssignedEvent?.id || null;
  const modulosCliente = eventoState?.modulosCliente || {};
  const effectiveRol = storeRol ?? rol;

  return resolveMenuItemsByRole({
    rol: effectiveRol,
    totalEventosAsignados,
    idEventoActivo,
    modulosCliente,
  });
}

export function resolveMenuItemsByRole({
  rol,
  totalEventosAsignados = 0,
  idEventoActivo = null,
  modulosCliente = {},
}) {
  const effectiveRol = rol;

  let items = baseItems[effectiveRol] || baseItems[ROLE_IDS.ADMIN_WEDDING] || [];

  if (effectiveRol === ROLE_IDS.CLIENTE) {
    if (!idEventoActivo) {
      return [CLIENT_HOME_MENU_ITEM];
    }

    const enabledItems = getEnabledClientModules(modulosCliente).map((item) => {
      if (item.needsEventoId && item.baseUrl) {
        return { ...item, id: item.key, url: `${item.baseUrl}/${idEventoActivo}` };
      }
      return { ...item, id: item.key };
    });

    if (totalEventosAsignados > 1) {
      return [CLIENT_HOME_MENU_ITEM, ...enabledItems];
    }

    return enabledItems;
  }

  return items;
}
