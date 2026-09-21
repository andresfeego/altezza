import FotosCompartidasModule from '@/components/eventos/modulos/fotos_compartidas/FotosCompartidasModule';
import useEventoStore from '@/components/initialized/stored/useEventoStore';

export default function FotosCompartidasPage() {
  const idEventoActivo = useEventoStore((state) => state.idEventoActivo);

  return <FotosCompartidasModule idEvento={idEventoActivo} />;
}
