import { LuBlocks, LuUsers } from 'react-icons/lu';
import { getEnabledClientModules } from '@/components/constants/clientModules';

export function resolveAdminEventClientModuleHref(idEvento, moduleKey) {
  if (!idEvento || !moduleKey) return '/admin/eventos';
  return `/admin/eventos/${idEvento}/modulo/${moduleKey}`;
}

export function buildEventContextNav(idEvento, moduleState = {}) {
  if (!idEvento) return [];

  const clientItems = getEnabledClientModules(moduleState)
    .map((moduleDef) => {
      return {
        id: moduleDef.key,
        label: moduleDef.label,
        icon: moduleDef.icon,
        href: resolveAdminEventClientModuleHref(idEvento, moduleDef.key),
        activeMatch: [resolveAdminEventClientModuleHref(idEvento, moduleDef.key)],
        group: 'client',
      };
    });

  const adminItems = [
    {
      id: 'admin-modulos',
      label: 'Administrar modulos',
      icon: <LuBlocks />,
      href: `/admin/eventos/${idEvento}/admin/modulos`,
      activeMatch: ['/admin/eventos/[idEvento]/admin/modulos'],
      group: 'admin',
    },
    {
      id: 'admin-usuarios',
      label: 'Usuarios del evento',
      icon: <LuUsers />,
      href: `/admin/eventos/${idEvento}/admin/usuarios`,
      activeMatch: ['/admin/eventos/[idEvento]/admin/usuarios'],
      group: 'admin',
    },
  ];

  return [...clientItems, ...adminItems];
}
