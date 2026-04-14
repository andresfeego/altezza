import { useEffect, useMemo, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiCopy, FiEdit2, FiLink2, FiRefreshCw, FiSearch, FiShield, FiUsers } from 'react-icons/fi';
import shellStyles from '@/components/admin/shared/AdminModuleShell.module.scss';
import styles from './usuarios.module.scss';
import PageShell from '@/components/ui/layout/PageShell';
import PageHeader from '@/components/ui/layout/PageHeader';
import ModalShell from '@/components/ui/layout/ModalShell';
import Button from '@/components/ui/actions/Button';
import ActionMenu from '@/components/ui/actions/ActionMenu';
import InlineChipAction from '@/components/ui/actions/InlineChipAction';
import {
  getEventosActivos,
  getRolesSistema,
  getUsuariosSistema,
} from '@/components/initialized/data/helpersGetDB';
import {
  asignarUsuarioAEvento,
  actualizarUsuarioSistema,
  crearUsuarioSistema,
  quitarUsuarioDeEvento,
  regenerarPassTempUsuario,
} from '@/components/initialized/data/helpersSetDB';
import toast, { dismissToast, showError, showSuccess } from '@/components/initialized/Toast';

const INITIAL_FORM = {
  nombres: '',
  apellidos: '',
  user: '',
  rol: '',
  telefon: '',
  estado: '1',
};

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

function buildWhatsappUrl(phone, message = '') {
  const digits = normalizePhone(phone);
  if (!digits || digits === '0' || digits === '1') return null;
  const encoded = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${encoded}`;
}

function PasswordToastContent({ title, subtitle, tempPassword, toastId }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      dismissToast(toastId);
      showSuccess('Clave temporal copiada al portapapeles.');
    } catch (error) {
      console.error(error);
      showError('No fue posible copiar la clave temporal.');
    }
  };

  return (
    <div className={styles.toastCard}>
      <div className={styles.toastText}>
        <span className={styles.toastTitle}>{title}</span>
        <span className={styles.toastSubtitle}>{subtitle}: {tempPassword}</span>
      </div>
      <button type="button" className={styles.toastAction} onClick={handleCopy}>
        <FiCopy size={16} />
        Copiar
      </button>
    </div>
  );
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [rolFiltro, setRolFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordModal, setPasswordModal] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [eventSearch, setEventSearch] = useState('');
  const [assigningEventId, setAssigningEventId] = useState(null);
  const [openActionMenuUserId, setOpenActionMenuUserId] = useState(null);
  const isEditing = Boolean(editingUserId);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [usuariosData, rolesData, eventosData] = await Promise.all([
        getUsuariosSistema(),
        getRolesSistema(),
        getEventosActivos(),
      ]);

      setUsuarios(usuariosData || []);
      setRoles(rolesData || []);
      setEventos(eventosData || []);
    } catch (error) {
      console.error(error);
      showError('No fue posible cargar el modulo de usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const search = filtro.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const fullName = `${usuario.nombres || ''} ${usuario.apellidos || ''}`.toLowerCase();
      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        String(usuario.user || '').toLowerCase().includes(search) ||
        String(usuario.telefon || '').toLowerCase().includes(search);

      const matchesRol = rolFiltro === 'todos' || String(usuario.rol) === rolFiltro;

      return matchesSearch && matchesRol;
    });
  }, [usuarios, filtro, rolFiltro]);

  const metricas = useMemo(() => {
    const activos = usuarios.filter((usuario) => Number(usuario.estado ?? 1) === 1).length;
    const inactivos = usuarios.length - activos;
    const conEvento = usuarios.filter((usuario) => usuario.eventosAsignados?.length).length;

    return {
      total: usuarios.length,
      activos,
      inactivos,
      conEvento,
    };
  }, [usuarios]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingUserId(null);
    setIsModalOpen(false);
  };

  const showPasswordToast = ({ title, subtitle, tempPassword }) => {
    toast((toastInstance) => (
      <PasswordToastContent
        title={title}
        subtitle={subtitle}
        tempPassword={tempPassword}
        toastId={toastInstance.id}
      />
    ), { duration: 8000 });
  };

  const handleEditarUsuario = (usuario) => {
    setOpenActionMenuUserId(null);
    setEditingUserId(usuario.id);
    setIsModalOpen(true);
    setForm({
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      user: usuario.user || '',
      rol: String(usuario.rol || ''),
      telefon: usuario.telefon || '',
      estado: String(usuario.estado ?? 1),
    });
  };

  const handleGuardarUsuario = async (event) => {
    event.preventDefault();

    if (!form.nombres || !form.apellidos || !form.user || !form.rol || !form.telefon) {
      showError('Completa todos los campos requeridos.');
      return;
    }

    setSaving(true);
    try {
      const result = isEditing
        ? await actualizarUsuarioSistema({
            idUsuario: editingUserId,
            ...form,
          })
        : await crearUsuarioSistema(form);

      if (!result?.success) {
        showError(isEditing ? 'No fue posible actualizar el usuario.' : 'No fue posible crear el usuario.');
        return;
      }

      if (result.tempPassword) {
        showPasswordToast({
          title: 'Usuario creado correctamente',
          subtitle: 'Clave temporal',
          tempPassword: result.tempPassword,
        });
      } else {
        showSuccess('Usuario actualizado correctamente.');
      }

      resetForm();
      await cargarDatos();
    } catch (error) {
      console.error(error);
      showError(
        error?.status === 409 || error?.data?.error === 409
          ? `No se pudo guardar el usuario porque el identificador "${form.user}" ya existe. Usa otro usuario.`
          : isEditing
            ? 'Ocurrio un error al actualizar el usuario.'
            : 'Ocurrio un error al crear el usuario.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAsignarEvento = async (idUsuario, idEvento) => {
    if (!idEvento) return;
    try {
      setAssigningEventId(idEvento);
      const result = await asignarUsuarioAEvento({ idUsuario, idEvento });

      if (!result?.success) {
        showError('No fue posible asignar el evento.');
        return;
      }

      showSuccess(result.alreadyAssigned ? 'El usuario ya estaba asignado a ese evento.' : 'Evento asignado correctamente.');
      await cargarDatos();
      if (!result.alreadyAssigned) {
        setAssignModal((current) => (current ? { ...current, eventosAsignados: [...(current.eventosAsignados || []), idEvento] } : current));
      }
    } catch (error) {
      console.error(error);
      showError('Ocurrio un error al asignar el evento.');
    } finally {
      setAssigningEventId(null);
    }
  };

  const handleQuitarEvento = async (idUsuario, idEvento) => {
    try {
      const result = await quitarUsuarioDeEvento({ idUsuario, idEvento });

      if (!result?.success) {
        showError('No fue posible quitar la asignacion.');
        return false;
      }

      showSuccess('Asignacion eliminada.');
      await cargarDatos();
      return true;
    } catch (error) {
      console.error(error);
      showError('Ocurrio un error al quitar la asignacion.');
      return false;
    }
  };

  const handleRegenerarPassTemp = async (usuario) => {
    setOpenActionMenuUserId(null);
    try {
      const result = await regenerarPassTempUsuario({ idUsuario: usuario.id });

      if (!result?.success || !result?.tempPassword) {
        showError('No fue posible regenerar la clave temporal.');
        return;
      }

      setPasswordModal({
        usuario,
        tempPassword: result.tempPassword,
      });
    } catch (error) {
      console.error(error);
      showError('Ocurrio un error al regenerar la clave temporal.');
    }
  };

  const eventosFiltrados = useMemo(() => {
    const term = eventSearch.trim().toLowerCase();
    if (!term) return eventos;

    return eventos.filter((evento) => {
      const nombre = String(evento?.nombre || '').toLowerCase();
      const id = String(evento?.id || '').toLowerCase();
      return nombre.includes(term) || id.includes(term);
    });
  }, [eventSearch, eventos]);

  const buildPasswordWhatsappMessage = (usuario, tempPassword) => {
    const nombre = `${usuario?.nombres || ''} ${usuario?.apellidos || ''}`.trim() || 'usuario';
    return `Hola ${nombre}. Desde Altezza compartimos tu nueva clave temporal de acceso: ${tempPassword}. Por favor ingresa con esta clave y actualizala por una personal en tu proximo acceso.`;
  };

  const getUserActionItems = (usuario) => ([
    {
      id: 'editar',
      label: 'Editar',
      icon: <FiEdit2 size={15} />,
      onClick: () => handleEditarUsuario(usuario),
    },
    {
      id: 'password',
      label: 'Generar pass temp',
      icon: <FiRefreshCw size={15} />,
      onClick: () => handleRegenerarPassTemp(usuario),
    },
    {
      id: 'eventos',
      label: 'Asignar eventos',
      icon: <FiLink2 size={15} />,
      onClick: () => {
        setOpenActionMenuUserId(null);
        setAssignModal(usuario);
        setEventSearch('');
      },
    },
  ]);

  return (
    <PageShell surface="admin" contentClassName={`${styles.page} ${shellStyles.page}`}>
        <section className={styles.hero}>
          <PageHeader
            title="Administracion de usuarios"
            align="right"
            actions={(
              <Button onClick={() => setIsModalOpen(true)}>
                Nuevo usuario
              </Button>
            )}
          />
          <div className={`${styles.summaryCard} ${shellStyles.summaryCard}`}>
            <div className={`${styles.summaryItem} ${shellStyles.summaryItem}`}>
              <div className={`${styles.summaryTop} ${shellStyles.summaryTop}`}>
                <span className={`${styles.metricIcon} ${shellStyles.metricIcon}`}><FiUsers size={14} /></span>
                <strong>{metricas.total}</strong>
              </div>
              <span>Registrados</span>
            </div>
            <div className={`${styles.summaryItem} ${shellStyles.summaryItem}`}>
              <div className={`${styles.summaryTop} ${shellStyles.summaryTop}`}>
                <span className={`${styles.metricIcon} ${shellStyles.metricIcon}`}><FiShield size={14} /></span>
                <strong>{metricas.activos}</strong>
              </div>
              <span>Activos</span>
            </div>
            <div className={`${styles.summaryItem} ${shellStyles.summaryItem}`}>
              <div className={`${styles.summaryTop} ${shellStyles.summaryTop}`}>
                <span className={`${styles.metricIcon} ${shellStyles.metricIcon}`}><FiLink2 size={14} /></span>
                <strong>{metricas.conEvento}</strong>
              </div>
              <span>Con evento</span>
            </div>
          </div>
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.tableCard} ${shellStyles.sectionCard}`}>
            <div className={styles.toolbar}>
              <div>
                <h2 className={shellStyles.sectionTitle}>Usuarios registrados</h2>
              </div>
              <div className={styles.filters}>
                <label className={styles.searchField}>
                  <FiSearch size={16} />
                  <input
                    placeholder="Buscar por nombre, usuario o telefono"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                </label>
                <select value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)}>
                  <option value="todos">Todos los roles</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={String(rol.id)}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className={styles.emptyState}>
                <strong>Cargando usuarios...</strong>
                <span>Estamos preparando la vista administrativa.</span>
              </div>
            ) : (
              <>
                <div className={styles.mobileList}>
                  {usuariosFiltrados.map((usuario) => (
                    <article key={`mobile-${usuario.id}`} className={styles.userCard}>
                      <div className={styles.userCardTop}>
                        <div>
                          <h3>{usuario.nombres} {usuario.apellidos}</h3>
                          <span>{usuario.user}</span>
                        </div>
                        <span className={usuario.estado ? styles.statusActive : styles.statusInactive}>
                          {usuario.estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      <div className={styles.userMeta}>
                        <span><strong>Rol:</strong> {usuario.rolNombre}</span>
                        <span><strong>Telefono:</strong> {usuario.telefon}</span>
                      </div>

                      <div className={styles.userSection}>
                        <strong>Eventos</strong>
                      <div className={styles.eventsCell}>
                        <div>
                          {usuario.eventosAsignados?.length ? (
                            usuario.eventosAsignados.map((idEvento) => (
                              <InlineChipAction
                                key={`mobile-${usuario.id}-${idEvento}`}
                                label={idEvento}
                                actionLabel="Quitar"
                                onAction={() => handleQuitarEvento(usuario.id, idEvento)}
                              />
                            ))
                          ) : (
                            <span className={styles.empty}>Sin eventos asignados</span>
                          )}
                        </div>
                      </div>
                      </div>

                      <div className={styles.mobileActions}>
                        <ActionMenu
                          open={openActionMenuUserId === `mobile-${usuario.id}`}
                          onToggle={() => setOpenActionMenuUserId((current) => current === `mobile-${usuario.id}` ? null : `mobile-${usuario.id}`)}
                          items={getUserActionItems(usuario)}
                        />
                      </div>
                    </article>
                  ))}

                  {!usuariosFiltrados.length && (
                    <div className={styles.emptyState}>
                      <strong>No hay usuarios que coincidan con los filtros actuales.</strong>
                      <span>Ajusta la busqueda o cambia el rol seleccionado.</span>
                    </div>
                  )}
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Telefono</th>
                        <th>Eventos</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>
                            <strong>{usuario.nombres} {usuario.apellidos}</strong>
                            <br />
                            {usuario.user}
                          </td>
                          <td>{usuario.rolNombre}</td>
                          <td>
                            <span className={usuario.estado ? styles.statusActive : styles.statusInactive}>
                              {usuario.estado ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>{usuario.telefon}</td>
                          <td>
                            <div className={styles.eventsCell}>
                              <div>
                                {usuario.eventosAsignados?.length ? (
                                  usuario.eventosAsignados.map((idEvento) => (
                                    <InlineChipAction
                                      key={`${usuario.id}-${idEvento}`}
                                      label={idEvento}
                                      actionLabel="Quitar"
                                      onAction={() => handleQuitarEvento(usuario.id, idEvento)}
                                    />
                                  ))
                                ) : (
                                  <span className={styles.empty}>Sin eventos asignados</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className={styles.rowActions}>
                              <ActionMenu
                                open={openActionMenuUserId === usuario.id}
                                onToggle={() => setOpenActionMenuUserId((current) => current === usuario.id ? null : usuario.id)}
                                items={getUserActionItems(usuario)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}

                      {!usuariosFiltrados.length && (
                        <tr>
                          <td colSpan="6" className={styles.empty}>
                            <div className={styles.emptyState}>
                              <strong>No hay usuarios que coincidan con los filtros actuales.</strong>
                              <span>Ajusta la busqueda o cambia el rol seleccionado.</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </article>
        </section>

        {isModalOpen && (
          <ModalShell title={isEditing ? 'Editar usuario' : 'Nuevo usuario'} onClose={resetForm}>
              <form className={styles.form} onSubmit={handleGuardarUsuario}>
                <div className={styles.twoCols}>
                  <label>
                    Nombres
                    <input value={form.nombres} onChange={(e) => handleFormChange('nombres', e.target.value)} />
                  </label>

                  <label>
                    Apellidos
                    <input value={form.apellidos} onChange={(e) => handleFormChange('apellidos', e.target.value)} />
                  </label>
                </div>

                <label>
                  Usuario
                  <input value={form.user} onChange={(e) => handleFormChange('user', e.target.value)} />
                </label>

                <div className={styles.twoCols}>
                  <label>
                    Rol
                    <select value={form.rol} onChange={(e) => handleFormChange('rol', e.target.value)}>
                      <option value="">Selecciona</option>
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.nombre}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Telefono
                    <input value={form.telefon} onChange={(e) => handleFormChange('telefon', e.target.value)} />
                  </label>
                </div>

                <label>
                  Estado
                  <select value={form.estado} onChange={(e) => handleFormChange('estado', e.target.value)}>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </label>

                <div className={styles.modalActions}>
                  <Button variant="secondary" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar cambios' : 'Crear usuario')}
                  </Button>
                </div>
              </form>
          </ModalShell>
        )}

        {passwordModal && (
          <ModalShell
            eyebrow="Gestion de acceso"
            title="Clave temporal generada"
            description="Comparte esta clave solo con el usuario correcto. La recomendacion es enviarla por WhatsApp y pedir cambio inmediato al primer ingreso."
            onClose={() => setPasswordModal(null)}
            footer={(
              <>
                <Button
                  variant="secondary"
                  iconLeading={<FiCopy size={16} />}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(passwordModal.tempPassword);
                      showSuccess('Clave temporal copiada al portapapeles.');
                    } catch (error) {
                      console.error(error);
                      showError('No fue posible copiar la clave temporal.');
                    }
                  }}
                >
                  Copiar
                </Button>
                <Button
                  as="a"
                  iconLeading={<FaWhatsapp size={16} />}
                  className={`${styles.modalPrimaryLink} ${!buildWhatsappUrl(passwordModal.usuario.telefon) ? styles.disabledButton : ''}`}
                  href={buildWhatsappUrl(
                    passwordModal.usuario.telefon,
                    buildPasswordWhatsappMessage(passwordModal.usuario, passwordModal.tempPassword)
                  ) || '#'}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!buildWhatsappUrl(passwordModal.usuario.telefon)}
                  onClick={(event) => {
                    if (!buildWhatsappUrl(passwordModal.usuario.telefon)) {
                      event.preventDefault();
                      showError('El usuario no tiene un telefono valido para WhatsApp.');
                    }
                  }}
                >
                  Enviar por WP
                </Button>
              </>
            )}
          >
              <div className={styles.passwordPanel}>
                <div className={styles.passwordBlock}>
                  <span className={styles.passwordLabel}>Usuario</span>
                  <strong>{passwordModal.usuario.nombres} {passwordModal.usuario.apellidos}</strong>
                  <span className={styles.passwordMeta}>{passwordModal.usuario.user}</span>
                </div>

                <div className={styles.passwordBlock}>
                  <span className={styles.passwordLabel}>Nueva clave temporal</span>
                  <strong className={styles.passwordValue}>{passwordModal.tempPassword}</strong>
                  <span className={styles.passwordMeta}>Uso unico sugerido para el siguiente acceso.</span>
                </div>
              </div>
          </ModalShell>
        )}

        {assignModal && (
          <ModalShell
            eyebrow="Relacion usuario-evento"
            title="Asignar eventos"
            description="Busca el evento correcto y gestiona las asignaciones activas desde una sola superficie."
            onClose={() => setAssignModal(null)}
            size="lg"
            className={styles.assignModalCard}
          >
              <div className={styles.assignModalBody}>
                <div className={styles.assignSummary}>
                  <strong>{assignModal.nombres} {assignModal.apellidos}</strong>
                  <span>{assignModal.user}</span>
                </div>

                <label className={`${styles.searchField} ${styles.modalSearchField}`}>
                  <FiSearch size={16} />
                  <input
                    placeholder="Buscar evento por nombre o id"
                    value={eventSearch}
                    onChange={(event) => setEventSearch(event.target.value)}
                  />
                </label>

                {assignModal.eventosAsignados?.length ? (
                  <div className={styles.assignedEventsWrap}>
                    <strong>Eventos asignados</strong>
                    <div className={styles.assignedEventsList}>
                      {assignModal.eventosAsignados.map((idEvento) => (
                        <InlineChipAction
                          key={`assign-modal-${assignModal.id}-${idEvento}`}
                          label={idEvento}
                          actionLabel="Quitar"
                          onAction={async () => {
                            const success = await handleQuitarEvento(assignModal.id, idEvento);
                            if (!success) return;
                            setAssignModal((current) => (
                              current
                                ? { ...current, eventosAsignados: (current.eventosAsignados || []).filter((value) => value !== idEvento) }
                                : current
                            ));
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className={styles.assignTableWrap}>
                  <table className={styles.assignTable}>
                    <thead>
                      <tr>
                        <th>Evento</th>
                        <th>ID</th>
                        <th>Accion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventosFiltrados.map((evento) => {
                        const yaAsignado = Array.isArray(assignModal.eventosAsignados) && assignModal.eventosAsignados.includes(evento.id);

                        return (
                        <tr key={`evento-${assignModal.id}-${evento.id}`}>
                          <td>{evento.nombre}</td>
                          <td>{evento.id}</td>
                          <td className={styles.assignActionCell}>
                              <Button
                                variant={yaAsignado ? 'secondary' : 'primary'}
                                className={`${styles.assignTableButton} ${yaAsignado ? styles.assignStatusButton : ''}`}
                                disabled={yaAsignado || assigningEventId === evento.id}
                                onClick={() => handleAsignarEvento(assignModal.id, evento.id)}
                              >
                                {yaAsignado ? 'Asignado' : assigningEventId === evento.id ? 'Guardando...' : 'Asignar'}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}

                      {!eventosFiltrados.length && (
                        <tr>
                          <td colSpan="3" className={styles.empty}>
                            <div className={styles.emptyState}>
                              <strong>No hay eventos que coincidan con la busqueda.</strong>
                              <span>Ajusta el termino para encontrar el evento que quieres asignar.</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          </ModalShell>
        )}
    </PageShell>
  );
}
