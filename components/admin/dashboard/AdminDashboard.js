import AdminUsuariosPreview from '@/components/admin/usuarios/AdminUsuariosPreview';
import AdminEventosPreview from '@/components/admin/eventos/AdminEventosPreview';
import AdminMobiliarioPreview from '@/components/admin/mobiliario/AdminMobiliarioPreview';
import AdminAlquilerPreview from '@/components/admin/alquiler/AdminAlquilerPreview';
import AdminCotizadorPreview from '@/components/admin/cotizador/AdminCotizadorPreview';
import AdminFrasesPreview from '@/components/admin/frases/AdminFrasesPreview';
import styles from './AdminDashboard.module.scss';

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
      </header>

      <section className={styles.grid} aria-label="Previews de modulos administrativos">
        <AdminUsuariosPreview />
        <AdminEventosPreview />
        <AdminMobiliarioPreview />
        <AdminAlquilerPreview />
        <AdminCotizadorPreview />
        <AdminFrasesPreview />
      </section>
    </div>
  );
}
