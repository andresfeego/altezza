import NavRail from '@/components/navigation/NavRail';
import { buildEventContextNav } from '@/components/navigation/buildEventContextNav';

export default function EventContextRail({ idEvento, moduleState = {}, className = '' }) {
  return (
    <NavRail
      items={buildEventContextNav(idEvento, moduleState)}
      ariaLabel="Navegacion del evento"
      tone="context"
      className={className}
    />
  );
}
