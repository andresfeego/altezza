import Button from '@/components/ui/actions/Button';
import styles from './invitaciones.module.scss';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'sinConfirmar', label: 'Sin confirmar' },
  { id: 'quiza', label: 'Quiza' },
  { id: 'asistire', label: 'Asistire' },
  { id: 'noAsistire', label: 'No asistire' },
];

export default function InvitacionesToolbar({
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
          type="search"
          className={styles.searchField}
          placeholder="Buscar por label, mensaje o integrante"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          disabled={disabled}
        />

        <Button onClick={onCreate} disabled={disabled}>
          Nueva invitacion
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
