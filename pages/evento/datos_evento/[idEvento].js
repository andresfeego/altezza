import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DatosEvento from '@/components/eventos/modulos/datos_evento/DatosEvento';
import BarraEvento from '@/components/eventos/feed/BarraEvento';
import LoadingScreen from '@/components/ui/LoadingScreen'; // ✅ importa el componente
import { getDetalleEvento } from '@/components/initialized/data/helpersGetDB';

export default function PaginaDatosEvento() {
  const router = useRouter();
  const { idEvento } = router.query;
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    if (!idEvento) return;

    const fetchEvento = async () => {
      const data = await getDetalleEvento(idEvento);
      if (data) setEvento(data);
    };

    fetchEvento();
  }, [idEvento]);

  if (!evento) return <LoadingScreen mensaje="Cargando datos del evento..." />;

  return (
    <>
      <BarraEvento
        tipo={evento.nombreTipoEvento}
        nombre={evento.nombre}
      />
      <DatosEvento evento={evento} />
    </>
  );
}
