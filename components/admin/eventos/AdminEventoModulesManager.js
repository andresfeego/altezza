import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { MdImage } from 'react-icons/md';
import Button from '@/components/ui/actions/Button';
import {
  buildClientModuleState,
  CLIENT_MODULE_DEFINITIONS,
} from '@/components/constants/clientModules';
import { getModulosClientePorEvento } from '@/components/initialized/data/helpersGetDB';
import { actualizarModulosClientePorEvento } from '@/components/initialized/data/helpersSetDB';
import { showError, showSuccess } from '@/components/initialized/Toast';
import styles from './AdminEventoModulesManager.module.scss';

export default function AdminEventoModulesManager({ evento = null, onModulesChange = null }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingKey, setSavingKey] = useState('');
  const selectedEventId = evento?.id || '';

  useEffect(() => {
    if (!selectedEventId) {
      setModules([]);
      return;
    }

    let cancelled = false;

    async function loadModules() {
      try {
        setLoading(true);
        const response = await getModulosClientePorEvento(selectedEventId);
        if (cancelled) return;
        setModules(response?.modules || []);
        onModulesChange?.(response?.modules || [], buildClientModuleState(response?.modules || []));
      } catch (error) {
        if (cancelled) return;
        setModules([]);
        showError('No fue posible cargar los modulos del evento.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadModules();

    return () => {
      cancelled = true;
    };
  }, [selectedEventId]);

  const modulesByKey = useMemo(() => {
    const byKey = {};
    for (const moduleDef of modules) {
      byKey[moduleDef.key] = moduleDef;
    }
    return byKey;
  }, [modules]);

  const renderedModules = CLIENT_MODULE_DEFINITIONS.map((moduleDef) => ({
    ...moduleDef,
    enabled: moduleDef.required ? true : Boolean(modulesByKey[moduleDef.key]?.enabled),
  }));

  const baseModulesCount = renderedModules.filter((moduleDef) => moduleDef.required).length;
  const enabledOptionalModules = renderedModules.filter((moduleDef) => !moduleDef.required && moduleDef.enabled);
  const configurableModulesCount = renderedModules.filter((moduleDef) => !moduleDef.required).length;
  const hasSelectedEventImage = Boolean(evento?.imagenPrincipal && evento.imagenPrincipal.length > 10);

  async function persistModules(nextModules, successMessage = 'Modulos del evento actualizados.') {
    if (!selectedEventId) return;

    try {
      const payload = CLIENT_MODULE_DEFINITIONS.map((moduleDef) => ({
        key: moduleDef.key,
        enabled: moduleDef.required ? true : Boolean(nextModules[moduleDef.key]),
      }))
        .filter((moduleDef) => !moduleDef.required)
        .map(({ key, enabled }) => ({ key, enabled }));

      const response = await actualizarModulosClientePorEvento({
        idEvento: selectedEventId,
        modules: payload,
      });

      setModules(response?.modules || []);
      onModulesChange?.(response?.modules || [], buildClientModuleState(response?.modules || []));
      showSuccess(successMessage);
    } catch (error) {
      showError('No fue posible guardar la configuracion de modulos.');
      throw error;
    }
  }

  async function handleToggleModule(moduleKey, enabled) {
    if (!selectedEventId) return;

    const previousModules = modules;
    const nextModules = {};

    for (const moduleDef of renderedModules) {
      if (moduleDef.required) {
        nextModules[moduleDef.key] = true;
        continue;
      }

      nextModules[moduleDef.key] =
        moduleDef.key === moduleKey ? enabled : Boolean(moduleDef.enabled);
    }

    const optimisticModules = previousModules.map((moduleItem) =>
      moduleItem.key === moduleKey ? { ...moduleItem, enabled } : moduleItem
    );

    setSavingKey(moduleKey);
    setModules(optimisticModules);
    onModulesChange?.(optimisticModules, buildClientModuleState(optimisticModules));

    try {
      await persistModules(
        nextModules,
        enabled ? 'Modulo activado.' : 'Modulo desactivado.'
      );
    } catch (error) {
      setModules(previousModules);
      onModulesChange?.(previousModules, buildClientModuleState(previousModules));
    } finally {
      setSavingKey('');
    }
  }

  if (!evento) {
    return (
      <section className={styles.wrapper}>
        <div className={styles.emptyState}>
          <h3>Evento no disponible</h3>
          <p>No fue posible cargar el evento para configurar sus modulos.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.selectedEvent}>
        <div className={styles.selectedEventMedia}>
          {hasSelectedEventImage ? (
            <Image
              src={evento.imagenPrincipal}
              alt={`Imagen del evento ${evento.nombre}`}
              fill
              unoptimized
            />
          ) : (
            <div className={styles.selectedEventPlaceholder}>
              <MdImage size={28} />
            </div>
          )}
        </div>

          <div className={styles.selectedEventBody}>
            <h3>{evento.nombre}</h3>
            <div className={styles.eventMeta}>
              <span>{evento.id}</span>
              <span>{evento.nombreTipoEvento || evento.tipoEvento || 'Sin tipo definido'}</span>
            </div>
          </div>

        <span className={`${styles.eventState} ${evento.estado ? styles.eventStateActive : styles.eventStateInactive}`}>
          {evento.estado ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryMetric}>
          <strong>{baseModulesCount}</strong>
          <span>Base</span>
        </div>
        <div className={styles.summaryMetric}>
          <strong>{enabledOptionalModules.length}</strong>
          <span>Activos</span>
        </div>
        <div className={styles.summaryMetric}>
          <strong>{configurableModulesCount}</strong>
          <span>Configurables</span>
        </div>
      </div>

      <div className={styles.moduleList}>
        {renderedModules.map((moduleDef) => (
          <article key={moduleDef.key} className={styles.moduleRow}>
            <div className={styles.moduleHeader}>
              <span className={styles.moduleIcon}>{moduleDef.icon}</span>
              <strong>{moduleDef.label}</strong>
            </div>

            <div className={styles.moduleFooter}>
              <div className={styles.moduleMeta}>
                {moduleDef.required ? (
                  <span className={`${styles.moduleState} ${styles.moduleStateEnabled}`}>
                    Activo
                  </span>
                ) : (
                  <Button
                    variant={moduleDef.enabled ? 'primary' : 'secondary'}
                    className={`${styles.moduleStateButton} ${moduleDef.enabled ? styles.moduleStateEnabled : styles.moduleStateDisabled}`}
                    disabled={loading || savingKey === moduleDef.key}
                    onClick={() => handleToggleModule(moduleDef.key, !moduleDef.enabled)}
                  >
                    {savingKey === moduleDef.key ? 'Guardando...' : moduleDef.enabled ? 'Activo' : 'Inactivo'}
                  </Button>
                )}

                {moduleDef.required ? (
                  <span className={styles.requiredBadge}>
                    <FiCheckCircle size={14} />
                    Base
                  </span>
                ) : null}
              </div>

            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
