import styles from './invitaciones.module.scss';

const METRICS = [
  { key: 'total', label: 'Total' },
  { key: 'conIntegrantes', label: 'Con integrantes' },
  { key: 'sinIntegrantes', label: 'Sin integrantes' },
  { key: 'pendientesAgrupar', label: 'Pendientes de agrupar' },
  { key: 'sinConfirmar', label: 'Sin confirmar' },
  { key: 'quiza', label: 'Quiza' },
  { key: 'asistire', label: 'Asistire' },
  { key: 'noAsistire', label: 'No asistire' },
];

export default function InvitacionesSummary({
  total,
  conIntegrantes,
  sinIntegrantes,
  pendientesAgrupar,
  sinConfirmar,
  quiza,
  asistire,
  noAsistire,
}) {
  const values = {
    total,
    conIntegrantes,
    sinIntegrantes,
    pendientesAgrupar,
    sinConfirmar,
    quiza,
    asistire,
    noAsistire,
  };

  return (
    <section className={styles.summaryCard}>
      {METRICS.map((metric) => (
        <div key={metric.key} className={styles.summaryMetric}>
          <strong>{values[metric.key] ?? 0}</strong>
          <span>{metric.label}</span>
        </div>
      ))}
    </section>
  );
}
