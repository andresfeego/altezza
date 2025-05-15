import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getResumenEventoById } from '@/components/initialized/data/helpersGetDB';
import FeedEvento from '@/components/eventos/feed/FeedEvento';

export default function PaginaFeedEvento() {
  const router = useRouter();
  const { idEvento } = router.query;
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    if (idEvento) {
      getResumenEventoById(idEvento).then((data) => {
        console.log(data)
        setEvento(data);
      });
    }
  }, [idEvento]);

  if (!evento) return <div>Cargando evento...</div>;

  return <FeedEvento evento={evento} />;
}
