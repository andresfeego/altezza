import { useRouter } from 'next/router';
import AdminEventWorkspaceLayout from '@/components/admin/eventos/AdminEventWorkspaceLayout';
import AdminEventClientModulePlaceholder from '@/components/admin/eventos/AdminEventClientModulePlaceholder';
import { CLIENT_MODULE_DEFINITIONS } from '@/components/constants/clientModules';
import styles from '@/components/admin/eventos/AdminEventWorkspaceLayout.module.scss';

export default function AdminEventClientModulePage() {
  const router = useRouter();
  const { idEvento, moduleKey } = router.query;

  return (
    <AdminEventWorkspaceLayout idEvento={idEvento}>
      {({ evento, loading, moduleState }) => {
        if (loading) {
          return <div className={styles.loadingState}>Cargando modulo del evento...</div>;
        }

        const moduleDef = CLIENT_MODULE_DEFINITIONS.find((item) => item.key === moduleKey);

        if (!moduleDef) {
          return (
            <section className={styles.surfaceCard}>
              <h1>Modulo no encontrado</h1>
              <p>No existe un modulo configurado para esta ruta.</p>
            </section>
          );
        }

        if (!moduleState[moduleKey]) {
          return (
            <section className={styles.surfaceCard}>
              <h1>{moduleDef.label}</h1>
              <p>Este modulo no esta activo para el evento actual.</p>
            </section>
          );
        }

        return (
          <AdminEventClientModulePlaceholder
            moduleKey={moduleKey}
            eventName={evento?.nombre || idEvento}
          />
        );
      }}
    </AdminEventWorkspaceLayout>
  );
}
