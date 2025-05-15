import { useEffect, useState } from 'react';
import { getEventosActivos } from '@/components/initialized/data/helpersGetDB';
import ListaEventos from '@/components/eventos/ListaEventos';

export default function Home() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    async function cargarEventos() {
      const data = await getEventosActivos();
      setEventos(data || []);
    }
    cargarEventos();
  }, []);

  return <ListaEventos eventos={eventos} />;
}
