import { useEffect, useMemo, useState } from 'react';
import AdminEventoSectionLayout from './AdminEventoSectionLayout';
import {
  CLIENT_MODULE_DEFINITIONS,
} from '@/components/constants/clientModules';
import { getModulosClientePorEvento } from '@/components/initialized/data/helpersGetDB';
import { showError } from '@/components/initialized/Toast';
import styles from './AdminEventoSections.module.scss';

export default function AdminEventoPreviewView({ idEvento }) {
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadModules() {
      try {
        setLoadingModules(true);
        const response = await getModulosClientePorEvento(idEvento);
        if (cancelled) return;
        setModules(response?.modules || []);
      } catch (error) {
        if (cancelled) return;
        setModules([]);
        showError('No fue posible cargar la configuracion de modulos del evento.');
      } finally {
        if (!cancelled) {
          setLoadingModules(false);
        }
      }
    }

    if (idEvento) {
      loadModules();
    }

    return () => {
      cancelled = true;
    };
  }, [idEvento]);

  const modulesByKey = useMemo(() => {
    const byKey = {};
    for (const moduleDef of modules) {
      byKey[moduleDef.key] = moduleDef;
    }
    return byKey;
  }, [modules]);

  const renderedModules = useMemo(
    () =>
      CLIENT_MODULE_DEFINITIONS.map((moduleDef) => ({
        ...moduleDef,
        enabled: moduleDef.required ? true : Boolean(modulesByKey[moduleDef.key]?.enabled),
      })),
    [modulesByKey]
  );

  const activeOptional = renderedModules.filter((moduleDef) => !moduleDef.required && moduleDef.enabled).length;

  return (
    <AdminEventoSectionLayout idEvento={idEvento} sectionId="preview" sectionTitle="Preview del cliente">
      {({ evento, loading }) => {
        if (loading || loadingModules) {
          return <div className={styles.inlineState}>Cargando preview del cliente...</div>;
        }

        if (!evento) {
          return <div className={styles.inlineState}>No fue posible cargar el evento para preview.</div>;
        }

        return (
          <div className={styles.stack}>
            <p className={styles.helperText}>
              Esta vista resume lo que quedara visible para cliente segun los modulos activos del evento.
            </p>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <strong>2</strong>
                <span>Base</span>
              </div>
              <div className={styles.metric}>
                <strong>{activeOptional}</strong>
                <span>Opcionales activos</span>
              </div>
            </div>

            <div className={styles.moduleList}>
              {renderedModules.map((moduleDef) => (
                <article key={moduleDef.key} className={styles.moduleRow}>
                  <div className={styles.moduleHeader}>
                    <div className={styles.moduleIdentity}>
                      <strong>{moduleDef.label}</strong>
                      <span>{moduleDef.required ? 'Modulo base del cliente' : 'Modulo opcional por evento'}</span>
                    </div>

                    <div className={styles.moduleMeta}>
                      <span className={`${styles.moduleBadge} ${moduleDef.enabled ? styles.moduleBadgeActive : styles.moduleBadgeInactive}`}>
                        {moduleDef.enabled ? 'Activo' : 'Inactivo'}
                      </span>
                      {moduleDef.required ? (
                        <span className={`${styles.moduleBadge} ${styles.moduleBadgeBase}`}>Base</span>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      }}
    </AdminEventoSectionLayout>
  );
}
