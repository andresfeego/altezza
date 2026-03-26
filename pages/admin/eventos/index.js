import layoutStyles from '@/components/home/AdminHome.module.scss';
import AdminEventos from '@/components/home/AdminEventos';

export default function AdminEventosPage() {
  return (
    <div className={layoutStyles.content}>
      <AdminEventos />
    </div>
  );
}
