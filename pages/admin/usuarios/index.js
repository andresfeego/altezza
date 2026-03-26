import { useEffect, useMemo, useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import layoutStyles from '@/components/home/AdminHome.module.scss';
import styles from './usuarios.module.scss';
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
  const [filtro, setFiltro] = useState('');
  const [rolFiltro, setRolFiltro] = useState('todos');
  const [eventoSeleccionadoPorUsuario, setEventoSeleccionadoPorUsuario] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingUserId(null);
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
    setEditingUserId(usuario.id);
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

  const handleAsignarEvento = async (idUsuario) => {
    const idEvento = eventoSeleccionadoPorUsuario[idUsuario];

    if (!idEvento) {
      showError('Selecciona un evento para asignar.');
      return;
    }

    try {
      const result = await asignarUsuarioAEvento({ idUsuario, idEvento });

      if (!result?.success) {
        showError('No fue posible asignar el evento.');
        return;
      }

      showSuccess(result.alreadyAssigned ? 'El usuario ya estaba asignado a ese evento.' : 'Evento asignado correctamente.');
      await cargarDatos();
    } catch (error) {
      console.error(error);
      showError('Ocurrio un error al asignar el evento.');
    }
  };

  const handleQuitarEvento = async (idUsuario, idEvento) => {
    try {
      const result = await quitarUsuarioDeEvento({ idUsuario, idEvento });

      if (!result?.success) {
        showError('No fue posible quitar la asignacion.');
        return;
      }

      showSuccess('Asignacion eliminada.');
      await cargarDatos();
    } catch (error) {
      console.error(error);
      showError('Ocurrio un error al quitar la asignacion.');
    }
  };

  const handleRegenerarPassTemp = async (usuario) => {
    try {
      const result = await regenerarPassTempUsuario({ idUsuario: usuario.id });

      if (!result?.success || !result?.tempPassword) {
        showError('No fue posible regenerar la clave temporal.');
        return;
      }

      showPasswordToast({
        title: `Clave temporal regenerada para ${usuario.nombres}`,
        subtitle: 'Nueva clave temporal',
        tempPassword: result.tempPassword,
      });
    } catch (error) {
      console.error(error);
      showError('Ocurrio un error al regenerar la clave temporal.');
    }
  };

  return (
    <div className={layoutStyles.content}>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div>
            <h1>Administracion de usuarios</h1>
            <p>
              Desde aqui puedes crear usuarios del sistema, revisar su rol actual y vincularlos con uno o varios eventos.
            </p>
          </div>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>{isEditing ? 'Editar usuario' : 'Crear usuario'}</h2>
                <p>
                  {isEditing
                    ? 'Ajusta los datos base del usuario seleccionado.'
                    : 'Crea un usuario del sistema y entrega su clave temporal.'}
                </p>
              </div>

              {isEditing && (
                <button type="button" className={styles.secondary} onClick={resetForm}>
                  Cancelar edicion
                </button>
              )}
            </div>

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

              <button className={styles.primary} type="submit" disabled={saving}>
                {saving ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar cambios' : 'Crear usuario')}
              </button>
            </form>
          </article>

          <article className={styles.card}>
            <div className={styles.toolbar}>
              <h2>Usuarios registrados</h2>
              <div className={styles.eventActions}>
                <input
                  placeholder="Buscar usuario"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
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
              <p>Cargando usuarios...</p>
            ) : (
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
                                  <span className={styles.tag} key={`${usuario.id}-${idEvento}`}>
                                    {idEvento}
                                    <button
                                      type="button"
                                      className={styles.secondary}
                                      onClick={() => handleQuitarEvento(usuario.id, idEvento)}
                                      style={{ marginLeft: 8, minHeight: 28 }}
                                    >
                                      Quitar
                                    </button>
                                  </span>
                                ))
                              ) : (
                                <span className={styles.empty}>Sin eventos asignados</span>
                              )}
                            </div>

                            <div className={styles.eventActions}>
                              <select
                                value={eventoSeleccionadoPorUsuario[usuario.id] || ''}
                                onChange={(e) =>
                                  setEventoSeleccionadoPorUsuario((prev) => ({
                                    ...prev,
                                    [usuario.id]: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Selecciona evento</option>
                                {eventos.map((evento) => (
                                  <option key={evento.id} value={evento.id}>
                                    {evento.nombre}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                className={styles.secondary}
                                onClick={() => handleAsignarEvento(usuario.id)}
                              >
                                Asignar
                              </button>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.secondary}
                              onClick={() => handleEditarUsuario(usuario)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className={styles.secondary}
                              onClick={() => handleRegenerarPassTemp(usuario)}
                            >
                              Generar pass temp
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!usuariosFiltrados.length && (
                      <tr>
                        <td colSpan="6" className={styles.empty}>
                          No hay usuarios que coincidan con los filtros actuales.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}
