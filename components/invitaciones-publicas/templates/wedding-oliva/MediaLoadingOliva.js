import LoadingScreen from '@/components/ui/LoadingScreen';
import styles from './MediaLoadingOliva.module.scss';

export default function MediaLoadingOliva({ phase, completed, total, onRetry }) {
  if (phase === 'ready') return null;
  const failed = phase === 'error';
  const progress = total > 0 ? Math.min(100, Math.max(0, (completed / total) * 100)) : 0;
  return (
    <div className={styles.layer} role={failed ? 'alert' : 'status'} aria-live="polite" data-invitation-loading data-state={phase}>
      <LoadingScreen mensaje={failed ? 'No pudimos terminar de cargar la invitación.' : 'Cargando invitación…'} busy={false}>
        <div className={styles.feedback}>
          {failed ? <>
            <p>Revisa tu conexión e inténtalo de nuevo.</p>
            <button type="button" onClick={onRetry}>Reintentar</button>
          </> : (
            <div className={styles.progress} role="progressbar" aria-label="Carga de la invitación" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
              <span className={styles.progressFill} style={{ transform: `scaleX(${progress / 100})` }} />
            </div>
          )}
        </div>
      </LoadingScreen>
    </div>
  );
}
