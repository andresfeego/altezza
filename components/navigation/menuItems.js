import { FiHome, FiBox, FiClipboard, FiSettings, FiCalendar } from 'react-icons/fi';
import { LuUserRoundCog, LuPartyPopper, LuCakeSlice } from 'react-icons/lu';
import { GiWoodenChair, GiLinkedRings } from 'react-icons/gi';
import { TbAlphabetLatin, TbTruckLoading , TbPhotoSpark} from 'react-icons/tb';
import { MdOutlinePriceChange, MdOutlineLiquor, MdPendingActions, MdOutlineTipsAndUpdates} from 'react-icons/md';
import { BsListTask } from "react-icons/bs";
import { ROLE_IDS } from '@/components/constants/roles';
import { IoRoseSharp, IoColorPaletteOutline} from "react-icons/io5";
import { FaRegLightbulb } from "react-icons/fa";
import { PiUsersFour } from "react-icons/pi";
import { IoMdTimer } from "react-icons/io";


import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';

export const baseItems = {
  [ROLE_IDS.ADMIN_WEDDING]: [
    { id: 'home', label: 'Home', icon: <FiHome />, url: '/home/admin' },
    { id: 'eventos', label: 'Eventos', icon: <LuPartyPopper />, url: '/admin/eventos' },
    { id: 'mobiliario', label: 'Mobiliario', icon: <GiWoodenChair />, url: '/admin/mobiliario' },
    { id: 'alquiler', label: 'Alquiler', icon: <TbTruckLoading />, url: '/admin/alquiler' },
    { id: 'cotizador', label: 'Cotizador', icon: <MdOutlinePriceChange />, url: '/admin/cotizador' },
    { id: 'frases', label: 'Frases', icon: <TbAlphabetLatin />, url: '/admin/frases' },
    { id: 'usuarios', label: 'Usuarios', icon: <LuUserRoundCog />, url: '/admin/usuarios' },
  ],
  [ROLE_IDS.CLIENTE]: [
    
    { id: 'feed', label: 'Feed del evento', icon: <FiHome />, baseUrl: '/evento/feed', needsEventoId: true },
    { id: 'datos-evento', label: 'Datos del evento', icon: <BsListTask />, baseUrl: '/evento/datos_evento', needsEventoId: true },
    { id: 'calculador-trago', label: 'Calculador de trago', icon: <MdOutlineLiquor />, url: '/evento/calculador_trago/calculador-trago' },
    { id: 'decoracion', label: 'Decoración', icon: <IoRoseSharp />, url: '/evento/decoracion/decoracion' },
    { id: 'fotos-compartidas', label: 'Fotos compartidas', icon: <TbPhotoSpark />, url: '/evento/fotos_compartidas/fotos-compartidas' },
    { id: 'inspiracion', label: 'Inspiración', icon: <FaRegLightbulb />, url: '/evento/inspiracion/inspiracion' },
    { id: 'invitados', label: 'Invitados', icon: <PiUsersFour />, url: '/evento/invitados/invitados' },
    { id: 'paletas-colores', label: 'Paletas de colores', icon: <IoColorPaletteOutline />, url: '/evento/paletas_de_colores/paletas-de-colores' },
    { id: 'pastel', label: 'Pastel', icon: <LuCakeSlice />, url: '/evento/pastel/pastel' },
    { id: 'pendientes', label: 'Pendientes', icon: <MdPendingActions />, url: '/evento/pendientes/pendientes' },
    { id: 'timming', label: 'Timming', icon: <IoMdTimer />, url: '/evento/timming/timming' },
    { id: 'tips-boda', label: 'Tips de boda', icon: <MdOutlineTipsAndUpdates />, url: '/evento/tips_boda/tips-boda' },
    { id: 'wedding-day', label: 'Wedding day', icon: <GiLinkedRings />, url: '/evento/wedding_day/wedding-day' },
  ],
  [ROLE_IDS.ORGANIZADOR]: [
    { id: 'organizador', label: 'Organizador', icon: <FiHome />, url: '/url_vacia' },
    { id: 'agenda', label: 'Agenda', icon: <FiCalendar />, url: '/url_vacia' },
    { id: 'pendientes', label: 'Pendientes', icon: <FiClipboard />, url: '/url_vacia' },
    { id: 'ajustes', label: 'Ajustes', icon: <FiSettings />, url: '/url_vacia' },
  ],
  [ROLE_IDS.COLABORADOR]: [
    { id: 'colaborador', label: 'Colaborador', icon: <FiHome />, url: '/url_vacia' },
    { id: 'agenda', label: 'Agenda', icon: <FiCalendar />, url: '/url_vacia' },
    { id: 'pendientes', label: 'Pendientes', icon: <FiClipboard />, url: '/url_vacia' },
    { id: 'ajustes', label: 'Ajustes', icon: <FiSettings />, url: '/url_vacia' },
  ],
};

export function getMenuItemsByRole(rol) {
  // Leer rol e idEventoAsignado directamente del store
  const state = typeof useUsuarioStore.getState === 'function' ? useUsuarioStore.getState() : {};
  const storeRol = state?.dataUsuario?.rol;
  const idEventoAsignado = state?.dataUsuario?.idEventoAsignado;

  const effectiveRol = storeRol ?? rol;
  let items = baseItems[effectiveRol] || baseItems[ROLE_IDS.ADMIN_WEDDING] || [];

  if (effectiveRol === ROLE_IDS.CLIENTE) {
    return items.map((item) => {
      if (item.needsEventoId && item.baseUrl) {
        const id = idEventoAsignado || 'evento_no_asignado';
        return { ...item, url: `${item.baseUrl}/${id}` };
      }
      return item;
    });
  }

  return items;
}
