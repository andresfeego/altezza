import { FiEye } from 'react-icons/fi';
import { LuClipboardList, LuUsers } from 'react-icons/lu';

export const ADMIN_EVENT_SECTIONS = [
  {
    id: 'datos',
    title: 'Datos del evento',
    message: 'Fechas, lugares, capacidad e identidad visual del evento.',
    icon: <LuClipboardList />,
    state: 'Listo',
  },
  {
    id: 'usuarios',
    title: 'Usuarios del evento',
    message: 'Usuarios vinculados al evento y estado actual de su acceso.',
    icon: <LuUsers />,
    state: 'Listo',
  },
  {
    id: 'preview',
    title: 'Preview del cliente',
    message: 'Vista administrativa de lo que quedara visible para el cliente.',
    icon: <FiEye />,
    state: 'Listo',
  },
];

export function getAdminEventoSectionHref(idEvento, sectionId) {
  if (!idEvento || !sectionId) return '/admin/eventos';
  return `/admin/eventos/${idEvento}/${sectionId}`;
}
