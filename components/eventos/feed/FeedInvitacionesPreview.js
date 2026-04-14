import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  getInvitacionesEvento,
  getInvitadosEvento,
} from '@/components/initialized/data/helpersGetDB';
import buildInvitacionesSummary from '@/components/eventos/modulos/invitaciones/buildInvitacionesSummary';
import styles from './FeedModulePreview.module.scss';

export default function FeedInvitacionesPreview({ href, eventId }) {
  const [invitaciones, setInvitaciones] = useState([]);
  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setInvitaciones([]);
      setInvitados([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadSummary() {
      try {
        setLoading(true);
        const [invitacionesResponse, invitadosResponse] = await Promise.all([
          getInvitacionesEvento(eventId),
          getInvitadosEvento(eventId),
        ]);

        if (cancelled) return;

        setInvitaciones(Array.isArray(invitacionesResponse) ? invitacionesResponse : []);
        setInvitados(Array.isArray(invitadosResponse) ? invitadosResponse : []);
      } catch (error) {
        if (cancelled) return;
        setInvitaciones([]);
        setInvitados([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const summary = useMemo(
    () => buildInvitacionesSummary(invitaciones, invitados),
    [invitaciones, invitados]
  );

  const metrics = [
    { label: 'Total', value: summary.total },
    { label: 'Con integrantes', value: summary.conIntegrantes },
    { label: 'Sin integrantes', value: summary.sinIntegrantes },
    { label: 'Pendientes', value: summary.pendientesAgrupar },
    { label: 'Sin confirmar', value: summary.sinConfirmar },
    { label: 'Quiza', value: summary.quiza },
    { label: 'Asistire', value: summary.asistire },
    { label: 'No asistire', value: summary.noAsistire },
  ];

  return (
    <Link href={href} className={styles.card}>
      <div className={styles.content}>
        <div className={styles.headerBlock}>
          <h3>Invitaciones</h3>
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
