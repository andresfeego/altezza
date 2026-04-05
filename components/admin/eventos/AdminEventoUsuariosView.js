import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import ActionMenu from '@/components/ui/actions/ActionMenu';
import Button from '@/components/ui/actions/Button';
import AdminEventoSectionLayout from './AdminEventoSectionLayout';
import { getUsuariosSistema } from '@/components/initialized/data/helpersGetDB';
import { actualizarUsuarioSistema, asignarUsuarioAEvento, quitarUsuarioDeEvento } from '@/components/initialized/data/helpersSetDB';
import { showError, showSuccess } from '@/components/initialized/Toast';
import styles from './AdminEventoSections.module.scss';

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

function buildWhatsappUrl(phone) {
  const digits = normalizePhone(phone);
  if (!digits || digits === '0' || digits === '1') return null;
  return `https://wa.me/${digits}`;
}

export default function AdminEventoUsuariosView({ idEvento }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [openMenuUserId, setOpenMenuUserId] = useState(null);

  const loadUsuarios = useCallback(async (cancelled = false) => {
    try {
      setLoadingUsuarios(true);
      const response = await getUsuariosSistema();
      if (cancelled) return;
      setUsuarios(Array.isArray(response) ? response : []);
    } catch (error) {
      if (cancelled) return;
      setUsuarios([]);
      showError('No fue posible cargar los usuarios del sistema.');
    } finally {
      if (!cancelled) {
        setLoadingUsuarios(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadUsuarios(cancelled);

    return () => {
      cancelled = true;
    };
  }, [loadUsuarios]);

  const usuariosEvento = useMemo(
    () =>
      usuarios.filter((usuario) =>
        Array.isArray(usuario?.eventosAsignados) && usuario.eventosAsignados.includes(idEvento)
      ),
    [idEvento, usuarios]
  );

  const usuariosDisponibles = useMemo(
    () =>
      usuarios.filter((usuario) => {
        const esCliente =
          String(usuario?.rolNombre || '').toLowerCase() === 'cliente' ||
          String(usuario?.rol) === '2';
        const yaAsignado =
          Array.isArray(usuario?.eventosAsignados) && usuario.eventosAsignados.includes(idEvento);
        return esCliente && !yaAsignado;
      }),
    [idEvento, usuarios]
  );

  const usuariosDisponiblesFiltrados = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return usuariosDisponibles;

    return usuariosDisponibles.filter((usuario) => {
      const nombre = `${usuario?.nombres || ''} ${usuario?.apellidos || ''}`.trim().toLowerCase();
      const user = String(usuario?.user || '').toLowerCase();
      return nombre.includes(term) || user.includes(term);
    });
  }, [searchValue, usuariosDisponibles]);

  async function handleAsignarUsuario(idUsuario) {
    if (!idUsuario || !idEvento) return;

    try {
      setSaving(true);
      await asignarUsuarioAEvento({ idUsuario, idEvento });
      showSuccess('Usuario asignado al evento.');
      await loadUsuarios();
    } catch (error) {
      showError(error?.data?.message || 'No fue posible asignar el usuario al evento.');
    } finally {
      setSaving(false);
    }
  }

  async function handleQuitarUsuario(idUsuario) {
    try {
      setSaving(true);
      setOpenMenuUserId(null);
      await quitarUsuarioDeEvento({ idUsuario, idEvento });
      showSuccess('Usuario removido del evento.');
      await loadUsuarios();
    } catch (error) {
      showError(error?.data?.message || 'No fue posible quitar el usuario del evento.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleEstado(usuario) {
    try {
      setSaving(true);
      setOpenMenuUserId(null);
      await actualizarUsuarioSistema({
        idUsuario: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        user: usuario.user,
        rol: usuario.rol,
        telefon: usuario.telefon,
        estado: usuario.estado ? 0 : 1,
      });
      showSuccess(usuario.estado ? 'Usuario desactivado.' : 'Usuario activado.');
      await loadUsuarios();
    } catch (error) {
      showError(error?.data?.message || 'No fue posible actualizar el estado del usuario.');
    } finally {
      setSaving(false);
    }
  }

  const getUserActionItems = (usuario) => ([
    {
      id: 'estado',
      label: usuario.estado ? 'Desactivar usuario' : 'Activar usuario',
      onClick: () => handleToggleEstado(usuario),
      disabled: saving,
    },
    {
      id: 'quitar',
      label: 'Quitar del evento',
      onClick: () => handleQuitarUsuario(usuario.id),
      disabled: saving,
    },
  ]);

  return (
    <AdminEventoSectionLayout idEvento={idEvento} sectionId="usuarios" sectionTitle="Usuarios del evento">
      {({ evento, loading }) => {
        if (loading || loadingUsuarios) {
          return <div className={styles.inlineState}>Cargando usuarios del evento...</div>;
        }

        if (!evento) {
          return <div className={styles.inlineState}>No fue posible cargar el contexto del evento.</div>;
        }

        return (
          <div className={styles.stack}>
            <div className={styles.assignPanel}>
              <input
                type="text"
                className={styles.assignField}
                placeholder="Buscar cliente por nombre o usuario"
                value={searchValue}
                disabled={saving}
                onChange={(event) => setSearchValue(event.target.value)}
              />

              {usuariosDisponiblesFiltrados.length ? (
                <div className={styles.availableList}>
                  {usuariosDisponiblesFiltrados.map((usuario) => (
                    <article key={`disponible-${usuario.id}`} className={styles.availableRow}>
                      <div className={styles.availableIdentity}>
                        <strong>{usuario.nombres} {usuario.apellidos}</strong>
                        <span>{usuario.user}</span>
                      </div>

                      <Button
                        className={styles.assignActionButton}
                        disabled={saving}
                        onClick={() => handleAsignarUsuario(usuario.id)}
                      >
                        {saving ? 'Guardando...' : 'Agregar'}
                      </Button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.inlineState}>
                  No hay clientes disponibles que coincidan con la busqueda.
                </div>
              )}
            </div>

            {usuariosEvento.length ? (
              <div className={styles.userList}>
                {usuariosEvento.map((usuario) => (
                  <article key={usuario.id} className={styles.userRow}>
                    <div className={styles.userHeader}>
                      <div className={styles.userTitleRow}>
                        <strong>{usuario.nombres} {usuario.apellidos}</strong>
                        <span className={styles.roleMeta}>{usuario.rolNombre || 'Sin rol'}</span>
                      </div>
                      <div className={styles.userIdentity}>
                        <span>{usuario.user}</span>
                      </div>
                    </div>

                    <div className={styles.userMeta}>
                      {buildWhatsappUrl(usuario.telefon) ? (
                        <>
                          <a
                            href={`tel:${normalizePhone(usuario.telefon)}`}
                            className={styles.phoneBadge}
                          >
                            <span className={styles.phoneIcon}>
                              <FiPhone />
                            </span>
                            <span>Cel.: {usuario.telefon}</span>
                          </a>
                          <a
                            href={buildWhatsappUrl(usuario.telefon)}
                            className={styles.whatsappBadge}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Abrir WhatsApp para ${usuario.nombres} ${usuario.apellidos}`}
                          >
                            <span className={styles.whatsappIcon}>
                              <FaWhatsapp />
                            </span>
                          </a>
                        </>
                      ) : null}
                    </div>

                    <div className={styles.rowActions}>
                      <span className={`${styles.statusPill} ${usuario.estado ? styles.statusActive : styles.statusInactive}`}>
                        {usuario.estado ? 'Activo' : 'Inactivo'}
                      </span>

                      <ActionMenu
                        open={openMenuUserId === usuario.id}
                        onToggle={() =>
                          setOpenMenuUserId((current) => (current === usuario.id ? null : usuario.id))
                        }
                        triggerLabel={`Acciones para ${usuario.nombres} ${usuario.apellidos}`}
                        items={getUserActionItems(usuario)}
                      />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.inlineState}>Este evento no tiene usuarios vinculados todavia.</div>
            )}
          </div>
        );
      }}
    </AdminEventoSectionLayout>
  );
}
