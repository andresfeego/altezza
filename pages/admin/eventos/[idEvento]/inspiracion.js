import { useRouter } from 'next/router';
import AdminEventWorkspaceLayout from '@/components/admin/eventos/AdminEventWorkspaceLayout';
import styles from '@/components/admin/eventos/AdminEventWorkspaceLayout.module.scss';

export default function AdminEventInspiracionPage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <AdminEventWorkspaceLayout idEvento={idEvento}>
      {({ evento, loading }) => {
        if (loading) {
          return <div className={styles.loadingState}>Cargando modulo de inspiracion...</div>;
        }

        return (
          <section className={styles.surfaceCard}>
            <h1>Inspiracion</h1>
            <p>
              Esta es la primera ruta piloto del modo admin dentro del evento. La siguiente iteracion debe reemplazar
              este placeholder por el modulo real para que el admin actue como cliente dentro del evento.
            </p>
            <p>
              Evento actual: <strong>{evento?.nombre || idEvento}</strong>
            </p>
          </section>
        );
      }}
    </AdminEventWorkspaceLayout>
  );
}
