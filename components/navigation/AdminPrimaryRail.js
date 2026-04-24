import NavRail from '@/components/navigation/NavRail';
import { buildAdminPrimaryNav } from '@/components/navigation/buildAdminPrimaryNav';

export default function AdminPrimaryRail() {
  return (
    <NavRail
      items={buildAdminPrimaryNav()}
      ariaLabel="Navegacion administrativa"
      tone="primary"
      collapsed
    />
  );
}
