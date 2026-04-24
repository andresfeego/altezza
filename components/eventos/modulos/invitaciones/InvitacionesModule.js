import { useEffect, useMemo, useState } from 'react';
import shellStyles from '@/components/home/AdminHome.module.scss';
import EventClientModuleShell from '@/components/eventos/shared/EventClientModuleShell';
import {
  getGruposEdad,
  getInvitadosEvento,
  getInvitacionesEvento,
  getParentescos,
} from '@/components/initialized/data/helpersGetDB';
import {
  actualizarInvitacionEvento,
  asignarInvitadoAInvitacion,
  crearInvitadoEvento,
  crearInvitacionEvento,
  definirPrincipalInvitacion,
  eliminarInvitacionEvento,
  quitarInvitadoDeInvitacion,
} from '@/components/initialized/data/helpersSetDB';
import { showError, showSuccess } from '@/components/initialized/Toast';
import Button from '@/components/ui/actions/Button';
import InvitacionCard from './InvitacionCard';
import InvitacionFormModal from './InvitacionFormModal';
import InvitacionesImportModal from './InvitacionesImportModal';
import InvitacionMembersModal from './InvitacionMembersModal';
import InvitacionesSummary from './InvitacionesSummary';
import InvitacionesToolbar from './InvitacionesToolbar';
import buildInvitacionesSummary from './buildInvitacionesSummary';
import styles from './invitaciones.module.scss';

function normalizeInvitacionList(response) {
  if (!Array.isArray(response)) return [];

  return response.map((item) => ({
    ...item,
    enviada: Boolean(Number(item?.enviada || 0)),
    listaInvitados: Array.isArray(item?.listaInvitados) ? item.listaInvitados : [],
  }));
}

function memberMatchesAttendanceFilter(member, filterId) {
  const confirmed = Number(member?.confirmado || 0);

  switch (filterId) {
    case 'sinConfirmar':
      return confirmed <= 0;
    case 'quiza':
      return confirmed === 2;
    case 'asistire':
      return confirmed === 1;
    case 'noAsistire':
      return confirmed === 3;
    case 'all':
    default:
      return true;
  }
}

function invitationMatchesAttendanceFilter(invitacion, filterId) {
  if (filterId === 'all') return true;

  const members = Array.isArray(invitacion?.listaInvitados) ? invitacion.listaInvitados : [];
  if (!members.length) return false;

  return members.some((member) => memberMatchesAttendanceFilter(member, filterId));
}

function filterInvitaciones(invitaciones, searchValue, selectedFilter) {
  const term = searchValue.trim().toLowerCase();
  const filteredByAttendance = invitaciones
    .filter((item) => invitationMatchesAttendanceFilter(item, selectedFilter))
    .map((item) => ({
      ...item,
      listaInvitadosOriginal: item.listaInvitados,
      listaInvitados: selectedFilter === 'all'
        ? item.listaInvitados
        : item.listaInvitados.filter((member) => memberMatchesAttendanceFilter(member, selectedFilter)),
    }));
  if (!term) return filteredByAttendance;

  return filteredByAttendance.filter((item) => {
    const members = Array.isArray(item?.listaInvitados) ? item.listaInvitados : [];

    return (
      String(item?.label || '').toLowerCase().includes(term)
      || String(item?.mensaje_personalizado || '').toLowerCase().includes(term)
      || members.some((member) => String(member?.nombre || '').toLowerCase().includes(term))
    );
  });
}

export default function InvitacionesModule({ idEvento, embedded = false }) {
  const [invitaciones, setInvitaciones] = useState([]);
  const [invitados, setInvitados] = useState([]);
  const [parentescos, setParentescos] = useState([]);
  const [gruposEdad, setGruposEdad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingInvitacion, setEditingInvitacion] = useState(null);
  const [managingInvitacion, setManagingInvitacion] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (!idEvento) {
      setLoading(false);
      setInvitaciones([]);
      setInvitados([]);
      return;
    }

    let cancelled = false;

    async function loadModule() {
      try {
        setLoading(true);
        const [listaInvitaciones, listaInvitados, listaParentescos, listaGruposEdad] = await Promise.all([
          getInvitacionesEvento(idEvento),
          getInvitadosEvento(idEvento),
          getParentescos(),
          getGruposEdad(),
        ]);

        if (cancelled) return;

        setInvitaciones(normalizeInvitacionList(listaInvitaciones));
        setInvitados(Array.isArray(listaInvitados) ? listaInvitados : []);
        setParentescos(Array.isArray(listaParentescos) ? listaParentescos : []);
        setGruposEdad(Array.isArray(listaGruposEdad) ? listaGruposEdad : []);
      } catch (error) {
        if (cancelled) return;
        setInvitaciones([]);
        setInvitados([]);
        setParentescos([]);
        setGruposEdad([]);
        showError('No fue posible cargar el modulo de invitaciones.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadModule();

    return () => {
      cancelled = true;
    };
  }, [idEvento]);

  const invitacionesFiltradas = useMemo(
    () => filterInvitaciones(invitaciones, searchValue, selectedFilter),
    [invitaciones, searchValue, selectedFilter]
  );

  const summary = useMemo(
    () => buildInvitacionesSummary(invitaciones, invitados),
    [invitaciones, invitados]
  );

  async function reloadModule() {
    const [listaInvitaciones, listaInvitados, listaParentescos, listaGruposEdad] = await Promise.all([
      getInvitacionesEvento(idEvento),
      getInvitadosEvento(idEvento),
      getParentescos(),
      getGruposEdad(),
    ]);

    setInvitaciones(normalizeInvitacionList(listaInvitaciones));
    setInvitados(Array.isArray(listaInvitados) ? listaInvitados : []);
    setParentescos(Array.isArray(listaParentescos) ? listaParentescos : []);
    setGruposEdad(Array.isArray(listaGruposEdad) ? listaGruposEdad : []);
  }

  async function handleSaveInvitacion(payload) {
    try {
      setSaving(true);

      if (editingInvitacion?.id) {
        await actualizarInvitacionEvento({
          idEvento,
          idInvitacion: editingInvitacion.id,
          ...payload,
        });
        showSuccess('Invitacion actualizada.');
      } else {
        await crearInvitacionEvento({
          idEvento,
          ...payload,
        });
        showSuccess('Invitacion creada.');
      }

      await reloadModule();
      setIsFormOpen(false);
      setEditingInvitacion(null);
    } catch (error) {
      showError(error?.data?.message || 'No fue posible guardar la invitacion.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAssignInvitado(invitado, asPrincipal = false) {
    if (!managingInvitacion?.id || !invitado?.id) return;

    try {
      setSaving(true);
      await asignarInvitadoAInvitacion({
        idEvento,
        idInvitacion: managingInvitacion.id,
        idInvitado: invitado.id,
        principal: asPrincipal,
      });
      showSuccess(asPrincipal ? 'Invitado agregado como principal.' : 'Invitado agregado a la invitacion.');
      await reloadModule();
    } catch (error) {
      showError(error?.data?.message || 'No fue posible agregar el invitado.');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveInvitado(invitado) {
    if (!managingInvitacion?.id || !invitado?.id) return;

    const confirmed = window.confirm(`Deseas quitar a ${invitado.nombre} de esta invitacion?`);
    if (!confirmed) return;

    try {
      setSaving(true);
      await quitarInvitadoDeInvitacion({
        idEvento,
        idInvitacion: managingInvitacion.id,
        idInvitado: invitado.id,
      });
      showSuccess('Invitado retirado de la invitacion.');
      await reloadModule();
    } catch (error) {
      showError(error?.data?.message || 'No fue posible quitar el invitado.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSetPrincipal(invitado) {
    if (!managingInvitacion?.id || !invitado?.id) return;

    try {
      setSaving(true);
      await definirPrincipalInvitacion({
        idEvento,
        idInvitacion: managingInvitacion.id,
        idInvitado: invitado.id,
      });
      showSuccess('Invitado principal actualizado.');
      await reloadModule();
    } catch (error) {
      showError(error?.data?.message || 'No fue posible actualizar el invitado principal.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteInvitacion(invitacion) {
    if (!invitacion?.id) return;

    const confirmed = window.confirm('Deseas eliminar esta invitacion? Los invitados seguiran existiendo en el evento.');
    if (!confirmed) return;

    try {
      setSaving(true);
      await eliminarInvitacionEvento({
        idEvento,
        idInvitacion: invitacion.id,
      });
      showSuccess('Invitacion eliminada.');
      await reloadModule();
    } catch (error) {
      showError(error?.data?.message || 'No fue posible eliminar la invitacion.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleInvitacionEnviada(invitacion, enviada) {
    if (!invitacion?.id) return;

    try {
      setSaving(true);
      await actualizarInvitacionEvento({
        idEvento,
        idInvitacion: invitacion.id,
        label: String(invitacion?.label || '').trim(),
        mensajePersonalizado: String(invitacion?.mensaje_personalizado || '').trim(),
        enviada: Boolean(enviada),
      });
      showSuccess(enviada ? 'Invitacion marcada como enviada.' : 'Invitacion marcada como no enviada.');
      await reloadModule();
    } catch (error) {
      showError(error?.data?.message || 'No fue posible actualizar el estado de envio.');
    } finally {
      setSaving(false);
    }
  }

  async function handleImportInvitaciones(invitacionesImportadas) {
    if (!Array.isArray(invitacionesImportadas) || !invitacionesImportadas.length) return;

    try {
      setSaving(true);

      for (const invitation of invitacionesImportadas) {
        const createdInvitation = await crearInvitacionEvento({
          idEvento,
          label: invitation.label,
          mensajePersonalizado: invitation.mensajePersonalizado,
        });

        const idInvitacion = createdInvitation?.id;
        if (!idInvitacion) {
          throw new Error('No fue posible crear una invitacion durante la importacion.');
        }

        for (const member of invitation.integrantes) {
          const createdGuest = await crearInvitadoEvento({
            idEvento,
            nombre: member.nombre,
            telefono: member.telefono,
            whatsapp: member.whatsapp,
            parentescoId: member.parentescoId,
            grupoEdadId: member.grupoEdadId,
          });

          if (!createdGuest?.id) {
            throw new Error('No fue posible crear un invitado durante la importacion.');
          }

          await asignarInvitadoAInvitacion({
            idEvento,
            idInvitacion,
            idInvitado: createdGuest.id,
            principal: Boolean(member.principal),
          });
        }
      }

      await reloadModule();
      setIsImportOpen(false);
      showSuccess('Importacion completada.');
    } catch (error) {
      showError(error?.data?.message || error?.message || 'No fue posible importar las invitaciones.');
    } finally {
      setSaving(false);
    }
  }

  const content = (
    <EventClientModuleShell
      eyebrow=""
      title="Invitaciones"
      description="Agrupa invitados existentes del evento dentro de invitaciones de trabajo antes de pasar a acomodacion."
    >
      <InvitacionesSummary
        total={summary.total}
        conIntegrantes={summary.conIntegrantes}
        sinIntegrantes={summary.sinIntegrantes}
        pendientesAgrupar={summary.pendientesAgrupar}
        sinConfirmar={summary.sinConfirmar}
        quiza={summary.quiza}
        asistire={summary.asistire}
        noAsistire={summary.noAsistire}
      />

      <InvitacionesToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onCreate={() => {
          setEditingInvitacion(null);
          setIsFormOpen(true);
        }}
        disabled={loading || saving}
      />

      <div className={styles.inlineActionsRow}>
        <Button variant="secondary" onClick={() => setIsImportOpen(true)} disabled={loading || saving}>
          Importar desde excel
        </Button>
      </div>

      {!idEvento ? (
        <div className={styles.emptyCard}>
          <h3>No hay un evento activo seleccionado</h3>
          <p>Selecciona un evento para estructurar las invitaciones y sus integrantes.</p>
        </div>
      ) : loading ? (
        <div className={styles.emptyCard}>
          <h3>Cargando invitaciones...</h3>
          <p>Estamos preparando las agrupaciones del evento.</p>
        </div>
      ) : invitacionesFiltradas.length ? (
        <section className={styles.invitationGrid}>
          {invitacionesFiltradas.map((invitacion, index) => (
            <InvitacionCard
              key={invitacion.id}
              invitacion={invitacion}
              index={index}
              openMenu={openMenuId === invitacion.id}
              onToggleMenu={() => {
                setOpenMenuId((current) => (current === invitacion.id ? null : invitacion.id));
              }}
              onCloseMenu={() => setOpenMenuId(null)}
              onEdit={() => {
                setOpenMenuId(null);
                setEditingInvitacion(invitacion);
                setIsFormOpen(true);
              }}
              onManageMembers={() => {
                setOpenMenuId(null);
                setManagingInvitacion(invitacion);
              }}
              onDelete={() => {
                setOpenMenuId(null);
                handleDeleteInvitacion(invitacion);
              }}
              onToggleSent={(enviada) => handleToggleInvitacionEnviada(invitacion, enviada)}
              busy={saving}
            />
          ))}
        </section>
      ) : (
        <div className={styles.emptyCard}>
          <h3>Sin invitaciones todavia</h3>
          <p>Crea la primera invitacion y empieza a agrupar a los invitados existentes del evento.</p>
        </div>
      )}

      <InvitacionFormModal
        open={isFormOpen}
        invitacion={editingInvitacion}
        saving={saving}
        onClose={() => {
          if (saving) return;
          setIsFormOpen(false);
          setEditingInvitacion(null);
        }}
        onSubmit={handleSaveInvitacion}
      />

      <InvitacionMembersModal
        open={Boolean(managingInvitacion?.id)}
        invitacion={invitaciones.find((item) => item.id === managingInvitacion?.id) || managingInvitacion}
        invitadosEvento={invitados}
        saving={saving}
        onClose={() => setManagingInvitacion(null)}
        onAssign={handleAssignInvitado}
        onRemove={handleRemoveInvitado}
        onSetPrincipal={handleSetPrincipal}
      />

      <InvitacionesImportModal
        open={isImportOpen}
        parentescos={parentescos}
        gruposEdad={gruposEdad}
        importing={saving}
        onClose={() => {
          if (saving) return;
          setIsImportOpen(false);
        }}
        onImport={handleImportInvitaciones}
      />
    </EventClientModuleShell>
  );

  if (embedded) {
    return <div className={styles.embeddedPage}>{content}</div>;
  }

  return (
    <div className={shellStyles.content}>
      <main className={styles.page}>{content}</main>
    </div>
  );
}
