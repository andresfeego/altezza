import { useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiPhone, FiPlus, FiStar, FiTrash2 } from 'react-icons/fi';
import Button from '@/components/ui/actions/Button';
import ModalShell from '@/components/ui/layout/ModalShell';
import styles from './invitaciones.module.scss';

function getInvitacionTitle(invitacion) {
  const label = String(invitacion?.label || '').trim();
  if (label) return label;
  return `Invitacion ${String(invitacion?.id || '').slice(-4) || ''}`.trim();
}

function filterInvitados(invitados, searchValue) {
  const term = searchValue.trim().toLowerCase();

  if (!term) return invitados;

  return invitados.filter((item) => (
    String(item?.nombre || '').toLowerCase().includes(term)
    || String(item?.telefono || '').toLowerCase().includes(term)
    || String(item?.labelInvitacion || '').toLowerCase().includes(term)
  ));
}

export default function InvitacionMembersModal({
  open,
  invitacion,
  invitadosEvento = [],
  saving = false,
  onClose,
  onAssign,
  onRemove,
  onSetPrincipal,
}) {
  const [searchValue, setSearchValue] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const integrantes = Array.isArray(invitacion?.listaInvitados) ? invitacion.listaInvitados : [];

  const invitadosDisponibles = useMemo(
    () => filterInvitados(invitadosEvento, searchValue).filter((item) => Number(item?.idInvitacion) !== Number(invitacion?.id)),
    [invitacion?.id, invitadosEvento, searchValue]
  );

  if (!open || !invitacion) return null;

  return (
    <ModalShell
      title={`Integrantes de ${getInvitacionTitle(invitacion)}`}
      description="Agrupa invitados existentes del evento dentro de esta invitacion y define quien queda como principal."
      onClose={onClose}
      footer={(
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cerrar
        </Button>
      )}
    >
      <div className={styles.manageGrid}>
        <section className={styles.invitationDetailSection}>
          <span className={styles.detailLabel}>Integrantes actuales</span>
          {integrantes.length ? (
            <div className={styles.membersList}>
              {integrantes.map((item) => (
                <article key={item.id} className={styles.memberRow}>
                  <div className={styles.memberIdentity}>
                    <strong>{item?.nombre || 'Invitado sin nombre'}</strong>
                    <div className={styles.memberSupport}>
                      {item?.telefono ? (
                        <span className={styles.supportLine}>
                          <FiPhone aria-hidden="true" />
                          {item.telefono}
                        </span>
                      ) : (
                        <span className={styles.supportMuted}>Sin telefono</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.memberActions}>
                    {item?.principal ? (
                      <span
                        className={`${styles.metaPill} ${styles.primaryMemberPill}`}
                        data-tooltip="Principal"
                      >
                        <FiStar aria-hidden="true" />
                        Principal
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        className={styles.iconOnlyActionButton}
                        onClick={() => onSetPrincipal(item)}
                        disabled={saving}
                        iconLeading={<FiStar />}
                        aria-label={`Hacer principal a ${item?.nombre || 'este invitado'}`}
                        data-tooltip="Hacer principal"
                      >
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className={styles.iconOnlyActionButton}
                      onClick={() => onRemove(item)}
                      disabled={saving}
                      iconLeading={<FiTrash2 />}
                      aria-label={`Eliminar a ${item?.nombre || 'este invitado'} de esta invitacion`}
                      data-tooltip="Eliminar invitado de esta invitacion"
                    >
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyInnerState}>
              <p>Esta invitacion todavia no tiene integrantes.</p>
            </div>
          )}
        </section>

        <section className={styles.invitationDetailSection}>
          <button
            type="button"
            className={`${styles.accordionTrigger} ${isPickerOpen ? styles.accordionTriggerOpen : ''}`}
            onClick={() => setIsPickerOpen((current) => !current)}
            aria-expanded={isPickerOpen}
          >
            <span>Agregar desde invitados</span>
            <span className={styles.accordionIcon} aria-hidden="true">
              {isPickerOpen ? <FiChevronUp /> : <FiChevronDown />}
            </span>
          </button>

          <div className={`${styles.accordionPanel} ${isPickerOpen ? styles.accordionPanelOpen : ''}`} aria-hidden={!isPickerOpen}>
            {isPickerOpen ? (
              <>
                <input
                  type="search"
                  className={styles.searchField}
                  placeholder="Buscar por nombre, telefono o invitacion actual"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  disabled={saving}
                />

                {invitadosDisponibles.length ? (
                  <div className={styles.membersListScrollable}>
                    {invitadosDisponibles.map((item) => {
                      const movingFromOtherInvitation = Boolean(item?.idInvitacion && Number(item?.idInvitacion) !== Number(invitacion?.id));

                      return (
                        <article key={item.id} className={styles.memberRow}>
                          <div className={styles.memberIdentity}>
                            <strong>{item?.nombre || 'Invitado sin nombre'}</strong>
                            <div className={styles.memberMetaRow}>
                              {item?.telefono ? (
                                <span className={styles.supportLine}>
                                  <FiPhone aria-hidden="true" />
                                  {item.telefono}
                                </span>
                              ) : (
                                <span className={styles.supportMuted}>Sin telefono</span>
                              )}
                              {movingFromOtherInvitation ? (
                                <span className={`${styles.metaPill} ${styles.metaMuted}`}>
                                  En {item?.labelInvitacion || 'otra invitacion'}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <Button
                            variant={movingFromOtherInvitation ? 'secondary' : 'primary'}
                            className={styles.assignButton}
                            onClick={() => onAssign(item, integrantes.length === 0)}
                            disabled={saving}
                            iconLeading={<FiPlus />}
                          >
                            Agregar
                          </Button>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className={styles.emptyInnerState}>
                    <p>No hay invitados disponibles con ese criterio.</p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </section>
      </div>
    </ModalShell>
  );
}
