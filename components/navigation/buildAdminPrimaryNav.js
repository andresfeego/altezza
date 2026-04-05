import { ROLE_IDS } from '@/components/constants/roles';
import { baseItems } from '@/components/navigation/menuItems';

export function buildAdminPrimaryNav() {
  return (baseItems[ROLE_IDS.ADMIN_WEDDING] || []).map((item) => ({
    ...item,
    href: item.url,
    activeMatch: [item.url],
  }));
}
