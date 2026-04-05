import { CLIENT_MODULE_DEFINITIONS } from '@/components/constants/clientModules';
import styles from './AdminEventWorkspaceLayout.module.scss';

export default function AdminEventClientModulePlaceholder({ moduleKey, eventName = '' }) {
  const moduleDef = CLIENT_MODULE_DEFINITIONS.find((item) => item.key === moduleKey);

  return (
    <section className={styles.surfaceCard}>
      <h1>{moduleDef?.label || 'Modulo del evento'}</h1>
      <p>
        Este acceso ya hace parte del nuevo workspace admin del evento. En esta fase queda conectado como
        placeholder funcional para completar la navegacion contextual con los mismos modulos que veria el cliente.
      </p>
      <p>
        Evento actual: <strong>{eventName || 'Evento'}</strong>
      </p>
      <p>
        Siguiente iteracion: reemplazar este placeholder por el modulo real del cliente dentro del shell admin.
      </p>
    </section>
  );
}
