import Button from '@/components/ui/actions/Button';
import styles from './invitados.module.scss';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'withoutInvitation', label: 'Sin invitacion' },
  { id: 'withWhatsapp', label: 'Con WhatsApp' },
];

export default function InvitadosToolbar({
  searchValue,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  onCreate,
  disabled = false,
}) {
  return (
    <section className={styles.toolbarCard}>
      <div className={styles.toolbarTop}>
        <input
          type="text"
          className={styles.searchField}
          placeholder="Buscar invitado por nombre o telefono"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          disabled={disabled}
        />

        <Button onClick={onCreate} disabled={disabled}>
          Nuevo invitado
        </Button>
      </div>

      <div className={styles.filterRow}>
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`${styles.filterChip} ${selectedFilter === filter.id ? styles.filterChipActive : ''}`}
            onClick={() => onFilterChange(filter.id)}
            disabled={disabled}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  );
}
