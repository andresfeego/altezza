import styles from './invitados.module.scss';

export default function InvitadosSummary({
  total = 0,
  sinInvitacion = 0,
  conWhatsapp = 0,
  principales = 0,
}) {
  const metrics = [
    { label: 'Total', value: total },
    { label: 'Principales', value: principales },
    { label: 'Sin invitacion', value: sinInvitacion },
    { label: 'Con WhatsApp', value: conWhatsapp },
  ];

  return (
    <section className={styles.summaryCard}>
      {metrics.map((metric) => (
        <div key={metric.label} className={styles.summaryMetric}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </div>
      ))}
    </section>
  );
}
