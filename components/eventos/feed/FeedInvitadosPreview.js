import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getInvitadosEvento } from '@/components/initialized/data/helpersGetDB';
import buildInvitadosSummary from '@/components/eventos/modulos/invitados/buildInvitadosSummary';
import styles from './FeedModulePreview.module.scss';

export default function FeedInvitadosPreview({ href, eventId }) {
  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setInvitados([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadInvitados() {
      try {
        setLoading(true);
        const response = await getInvitadosEvento(eventId);
        if (cancelled) return;
        setInvitados(Array.isArray(response) ? response : []);
      } catch (error) {
        if (cancelled) return;
        setInvitados([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInvitados();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const summary = useMemo(() => buildInvitadosSummary(invitados), [invitados]);

  const metrics = [
    { label: 'Total', value: summary.total },
    { label: 'Principales', value: summary.principales },
    { label: 'Sin invitacion', value: summary.sinInvitacion },
    { label: 'WhatsApp', value: summary.conWhatsapp },
  ];

  return (
    <Link href={href} className={styles.card}>
      <div className={styles.content}>
        <div className={styles.headerBlock}>
          <h3>Invitados</h3>
        </div>

        <div className={styles.summaryGrid}>
          {metrics.map((metric) => (
            <div key={metric.label} className={styles.summaryItem}>
              <strong>{loading ? '...' : metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
