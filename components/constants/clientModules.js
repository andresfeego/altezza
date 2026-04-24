import {
  BsListTask,
} from 'react-icons/bs';
import {
  FaRegLightbulb,
} from 'react-icons/fa';
import {
  FiHome,
} from 'react-icons/fi';
import {
  GiLinkedRings,
  GiTabletopPlayers,
} from 'react-icons/gi';
import {
  HiOutlineEnvelopeOpen,
} from 'react-icons/hi2';
import {
  IoColorPaletteOutline,
} from 'react-icons/io5';
import {
  IoMdTimer,
} from 'react-icons/io';
import {
  LuCakeSlice,
} from 'react-icons/lu';
import {
  MdOutlineLiquor,
  MdOutlineTipsAndUpdates,
  MdPendingActions,
} from 'react-icons/md';
import {
  PiUsersFour,
} from 'react-icons/pi';
import {
  TbPhotoSpark,
} from 'react-icons/tb';

export const CLIENT_HOME_MENU_ITEM = {
  id: 'cliente-home',
  label: 'Mi evento',
  icon: <FiHome />,
  url: '/home/cliente',
};

export const CLIENT_MODULE_DEFINITIONS = [
  {
    key: 'feed',
    label: 'Feed del evento',
    icon: <FiHome />,
    required: true,
    defaultEnabled: true,
    needsEventoId: true,
    baseUrl: '/evento/feed',
  },
  {
    key: 'datos_evento',
    label: 'Datos del evento',
    icon: <BsListTask />,
    required: false,
    defaultEnabled: true,
    needsEventoId: true,
    baseUrl: '/evento/datos_evento',
  },
  {
    key: 'calculador_trago',
    label: 'Calculador de trago',
    icon: <MdOutlineLiquor />,
    url: '/evento/calculador_trago/calculador-trago',
  },
  {
    key: 'fotos_compartidas',
    label: 'Fotos compartidas',
    icon: <TbPhotoSpark />,
    url: '/evento/fotos_compartidas/fotos-compartidas',
  },
  {
    key: 'inspiracion',
    label: 'Inspiración',
    icon: <FaRegLightbulb />,
    url: '/evento/inspiracion/inspiracion',
  },
  {
    key: 'invitados',
    label: 'Invitados',
    icon: <PiUsersFour />,
    url: '/evento/invitados/invitados',
  },
  {
    key: 'invitaciones',
    label: 'Invitaciones',
    icon: <HiOutlineEnvelopeOpen />,
    url: '/evento/invitaciones/invitaciones',
  },
  {
    key: 'acomodacion',
    label: 'Acomodación',
    icon: <GiTabletopPlayers />,
    url: '/evento/acomodacion/acomodacion',
  },
  {
    key: 'paletas_colores',
    label: 'Paletas de colores',
    icon: <IoColorPaletteOutline />,
    url: '/evento/paletas_de_colores/paletas-de-colores',
  },
  {
    key: 'pastel',
    label: 'Pastel',
    icon: <LuCakeSlice />,
    url: '/evento/pastel/pastel',
  },
  {
    key: 'pendientes',
    label: 'Pendientes',
    icon: <MdPendingActions />,
    url: '/evento/pendientes/pendientes',
  },
  {
    key: 'timming',
    label: 'Timming',
    icon: <IoMdTimer />,
    url: '/evento/timming/timming',
  },
  {
    key: 'tips_boda',
    label: 'Tips de boda',
    icon: <MdOutlineTipsAndUpdates />,
    url: '/evento/tips_boda/tips-boda',
  },
  {
    key: 'wedding_day',
    label: 'Wedding day',
    icon: <GiLinkedRings />,
    url: '/evento/wedding_day/wedding-day',
  },
];

function resolveModuleDefaultEnabled(moduleDef = {}) {
  if (typeof moduleDef.defaultEnabled === 'boolean') {
    return moduleDef.defaultEnabled;
  }
  return Boolean(moduleDef.required);
}

export function getDefaultClientModuleState() {
  return CLIENT_MODULE_DEFINITIONS.reduce((acc, moduleDef) => {
    acc[moduleDef.key] = resolveModuleDefaultEnabled(moduleDef);
    return acc;
  }, {});
}

export function buildClientModuleState(modules = []) {
  const defaultState = getDefaultClientModuleState();

  if (!Array.isArray(modules)) {
    return defaultState;
  }

  return modules.reduce((acc, moduleDef) => {
    if (!moduleDef?.key) return acc;
    acc[moduleDef.key] = Boolean(moduleDef.enabled);
    return acc;
  }, defaultState);
}

export function getEnabledClientModules(moduleState = {}) {
  return CLIENT_MODULE_DEFINITIONS.filter((moduleDef) => moduleState[moduleDef.key]);
}

export function resolveClientModuleUrl(moduleDef, eventId) {
  if (!moduleDef) return '/home/cliente';

  if (moduleDef.needsEventoId && moduleDef.baseUrl) {
    return eventId ? `${moduleDef.baseUrl}/${eventId}` : '/home/cliente';
  }

  return moduleDef.url || '/home/cliente';
}

export function getClientModuleByPathname(pathname = '') {
  return (
    CLIENT_MODULE_DEFINITIONS.find((moduleDef) => {
      if (moduleDef.baseUrl) {
        return pathname === moduleDef.baseUrl || pathname.startsWith(`${moduleDef.baseUrl}/`);
      }

      if (moduleDef.url) {
        return pathname === moduleDef.url || pathname.startsWith(moduleDef.url);
      }

      return false;
    }) || null
  );
}

export function isClientModuleEnabled(moduleKey, moduleState = {}) {
  const moduleDef = CLIENT_MODULE_DEFINITIONS.find((item) => item.key === moduleKey);
  if (!moduleDef) return false;
  if (moduleDef.required) return true;
  if (!Object.prototype.hasOwnProperty.call(moduleState, moduleKey)) {
    return resolveModuleDefaultEnabled(moduleDef);
  }
  return Boolean(moduleState[moduleKey]);
}
