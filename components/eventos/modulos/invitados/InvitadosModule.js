import { useEffect, useMemo, useState } from 'react';
import shellStyles from '@/components/home/AdminHome.module.scss';
import EventClientModuleShell from '@/components/eventos/shared/EventClientModuleShell';
import {
  getGruposEdad,
  getInvitadosEvento,
  getPaisesTelefono,
  getParentescos,
} from '@/components/initialized/data/helpersGetDB';
import { actualizarInvitadoEvento, crearInvitadoEvento, eliminarInvitadoEvento } from '@/components/initialized/data/helpersSetDB';
import { confirmToast, showError, showSuccess } from '@/components/initialized/Toast';
import InvitadoFormModal from './InvitadoFormModal';
import InvitacionDetailModal from './InvitacionDetailModal';
import InvitadosList from './InvitadosList';
import InvitadosSummary from './InvitadosSummary';
import InvitadosToolbar from './InvitadosToolbar';
import buildInvitadosSummary from './buildInvitadosSummary';
import styles from './invitados.module.scss';

function filterInvitados(invitados, searchValue, selectedFilter) {
  const term = searchValue.trim().toLowerCase();

  return invitados.filter((invitado) => {
    const matchesSearch = !term
      || String(invitado?.nombre || '').toLowerCase().includes(term)
      || String(invitado?.telefono || '').toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (selectedFilter === 'withoutInvitation') {
      return !invitado?.idInvitacion;
    }

    if (selectedFilter === 'withWhatsapp') {
      return Boolean(invitado?.wp);
    }

    return true;
  });
}

export default function InvitadosModule({ idEvento, embedded = false }) {
  const [invitados, setInvitados] = useState([]);
  const [parentescos, setParentescos] = useState([]);
  const [gruposEdad, setGruposEdad] = useState([]);
  const [paisesTelefono, setPaisesTelefono] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvitado, setEditingInvitado] = useState(null);
  const [activeInvitation, setActiveInvitation] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (!idEvento) {
      setLoading(false);
      setInvitados([]);
      return;
    }

    let cancelled = false;

    async function loadModule() {
      try {
        setLoading(true);
        const [listaInvitados, listaParentescos, listaGruposEdad, listaPaisesTelefono] = await Promise.all([
          getInvitadosEvento(idEvento),
          getParentescos(),
          getGruposEdad(),
          getPaisesTelefono(),
        ]);

        if (cancelled) return;

        setInvitados(Array.isArray(listaInvitados) ? listaInvitados : []);
        setParentescos(Array.isArray(listaParentescos) ? listaParentescos : []);
        setGruposEdad(Array.isArray(listaGruposEdad) ? listaGruposEdad : []);
        setPaisesTelefono(Array.isArray(listaPaisesTelefono) ? listaPaisesTelefono : []);
      } catch (error) {
        if (cancelled) return;
        setInvitados([]);
        showError('No fue posible cargar el modulo de invitados.');
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

  const invitadosFiltrados = useMemo(
    () => filterInvitados(invitados, searchValue, selectedFilter),
    [invitados, searchValue, selectedFilter]
  );

  const summary = useMemo(() => buildInvitadosSummary(invitados), [invitados]);

  async function reloadInvitados() {
    const listaInvitados = await getInvitadosEvento(idEvento);
    setInvitados(Array.isArray(listaInvitados) ? listaInvitados : []);
  }

  async function handleSaveInvitado(payload) {
    try {
      setSaving(true);

      if (editingInvitado?.id) {
        await actualizarInvitadoEvento({
          idEvento,
          idInvitado: editingInvitado.id,
          ...payload,
          estadoAsistenciaId: editingInvitado?.estadoAsistenciaId,
        });
        showSuccess('Invitado actualizado.');
      } else {
        await crearInvitadoEvento({
          idEvento,
          ...payload,
        });
        showSuccess('Invitado creado.');
      }

      await reloadInvitados();
      setOpenMenuId(null);
      setEditingInvitado(null);
      setIsModalOpen(false);
    } catch (error) {
      showError(error?.data?.message || 'No fue posible guardar el invitado.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteInvitado(invitado) {
    if (!invitado?.id) return;

    const confirmed = await confirmToast({
      title: 'Eliminar invitado',
      message: `Deseas eliminar a ${invitado.nombre}?`,
      confirmLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      confirmVariant: 'danger',
    });
    if (!confirmed) return;

    try {
      setSaving(true);
      setOpenMenuId(null);
      await eliminarInvitadoEvento({ idEvento, idInvitado: invitado.id });
      showSuccess('Invitado eliminado.');
      await reloadInvitados();
    } catch (error) {
      showError(error?.data?.message || 'No fue posible eliminar el invitado.');
    } finally {
      setSaving(false);
    }
  }

  const content = (
    <EventClientModuleShell
      eyebrow=""
      title="Invitados"
      description="Construye la base de personas del evento antes de pasar a invitaciones y acomodacion."
    >

      <InvitadosSummary
        total={summary.total}
        principales={summary.principales}
        sinInvitacion={summary.sinInvitacion}
        conWhatsapp={summary.conWhatsapp}
      />

      <InvitadosToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onCreate={() => {
          setEditingInvitado(null);
          setIsModalOpen(true);
        }}
        disabled={loading || saving}
      />

      {!idEvento ? (
        <div className={styles.emptyCard}>
          <h3>No hay un evento activo seleccionado</h3>
          <p>Selecciona un evento desde el home del cliente o desde el workspace admin para gestionar invitados.</p>
        </div>
      ) : loading ? (
        <div className={styles.emptyCard}>
          <h3>Cargando invitados...</h3>
          <p>Estamos preparando la base de invitados del evento.</p>
        </div>
      ) : (
        <InvitadosList
          invitados={invitadosFiltrados}
          onEdit={(invitado) => {
            setOpenMenuId(null);
            setEditingInvitado(invitado);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteInvitado}
          onOpenInvitation={(invitado) => {
            setOpenMenuId(null);
            setActiveInvitation(invitado);
          }}
          openMenuId={openMenuId}
          onToggleMenu={(idInvitado) => {
            setOpenMenuId((current) => (current === idInvitado ? null : idInvitado));
          }}
          onCloseMenu={() => setOpenMenuId(null)}
          busy={saving}
        />
      )}

      <InvitadoFormModal
        open={isModalOpen}
        invitado={editingInvitado}
        parentescos={parentescos}
        gruposEdad={gruposEdad}
        paisesTelefono={paisesTelefono}
        saving={saving}
        onClose={() => {
          if (saving) return;
          setIsModalOpen(false);
          setEditingInvitado(null);
        }}
        onSubmit={handleSaveInvitado}
      />

      <InvitacionDetailModal
        open={Boolean(activeInvitation?.idInvitacion)}
        idInvitacion={activeInvitation?.idInvitacion}
        invitadoNombre={activeInvitation?.nombre}
        parentescos={parentescos}
        gruposEdad={gruposEdad}
        onClose={() => setActiveInvitation(null)}
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
