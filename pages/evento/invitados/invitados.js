import InvitadosModule from '@/components/eventos/modulos/invitados/InvitadosModule';
import useEventoStore from '@/components/initialized/stored/useEventoStore';

export default function InvitadosPage() {
  const idEventoActivo = useEventoStore((state) => state.idEventoActivo);

  return <InvitadosModule idEvento={idEventoActivo} />;
}
