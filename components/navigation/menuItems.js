import { FiHome } from 'react-icons/fi';
import { LuUserRoundCog, LuPartyPopper, LuCakeSlice } from 'react-icons/lu';
import { GiWoodenChair, GiLinkedRings } from 'react-icons/gi';
import { TbAlphabetLatin, TbTruckLoading , TbPhotoSpark} from 'react-icons/tb';
import { MdOutlinePriceChange, MdOutlineLiquor, MdPendingActions, MdOutlineTipsAndUpdates} from 'react-icons/md';
import { BsListTask } from "react-icons/bs";
import { ROLE_IDS } from '@/components/constants/roles';
import { IoColorPaletteOutline} from "react-icons/io5";
import { FaRegLightbulb } from "react-icons/fa";
import { PiUsersFour } from "react-icons/pi";
import { IoMdTimer } from "react-icons/io";
import { HiOutlineEnvelopeOpen } from "react-icons/hi2";
import { GiTabletopPlayers } from "react-icons/gi";


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
    { id: 'fotos-compartidas', label: 'Fotos compartidas', icon: <TbPhotoSpark />, url: '/evento/fotos_compartidas/fotos-compartidas' },
    { id: 'inspiracion', label: 'Inspiración', icon: <FaRegLightbulb />, url: '/evento/inspiracion/inspiracion' },
    { id: 'invitados', label: 'Invitados', icon: <PiUsersFour />, url: '/evento/invitados/invitados' },
    { id: 'invitaciones', label: 'Invitaciones', icon: <HiOutlineEnvelopeOpen />, url: '/evento/invitaciones/invitaciones' },
    { id: 'acomodacion', label: 'Acomodación', icon: <GiTabletopPlayers />, url: '/evento/acomodacion/acomodacion' },
    { id: 'paletas-colores', label: 'Paletas de colores', icon: <IoColorPaletteOutline />, url: '/evento/paletas_de_colores/paletas-de-colores' },
    { id: 'pastel', label: 'Pastel', icon: <LuCakeSlice />, url: '/evento/pastel/pastel' },
    { id: 'pendientes', label: 'Pendientes', icon: <MdPendingActions />, url: '/evento/pendientes/pendientes' },
    { id: 'timming', label: 'Timming', icon: <IoMdTimer />, url: '/evento/timming/timming' },
    { id: 'tips-boda', label: 'Tips de boda', icon: <MdOutlineTipsAndUpdates />, url: '/evento/tips_boda/tips-boda' },
    { id: 'wedding-day', label: 'Wedding day', icon: <GiLinkedRings />, url: '/evento/wedding_day/wedding-day' },
  ],
  [ROLE_IDS.ORGANIZADOR]: [
    { id: 'organizador', label: 'Organizador', icon: <FiHome />, url: '/home/organizador' },
  ],
  [ROLE_IDS.COLABORADOR]: [
    { id: 'colaborador', label: 'Colaborador', icon: <FiHome />, url: '/home/colaborador' },
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
    if (!idEventoAsignado) {
      return [
        { id: 'cliente-home', label: 'Mi evento', icon: <FiHome />, url: '/home/cliente' },
      ];
    }

    return items.map((item) => {
      if (item.needsEventoId && item.baseUrl) {
        return { ...item, url: `${item.baseUrl}/${idEventoAsignado}` };
      }
      return item;
    });
  }

  return items;
}
