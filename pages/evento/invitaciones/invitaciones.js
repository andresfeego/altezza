import InvitacionesModule from '@/components/eventos/modulos/invitaciones/InvitacionesModule';
import useEventoStore from '@/components/initialized/stored/useEventoStore';

export default function InvitacionesPage() {
  const idEventoActivo = useEventoStore((state) => state.idEventoActivo);

  return <InvitacionesModule idEvento={idEventoActivo} />;
}
