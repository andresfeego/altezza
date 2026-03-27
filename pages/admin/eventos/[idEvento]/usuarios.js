import { useRouter } from 'next/router';
import AdminEventoUsuariosView from '@/components/admin/eventos/AdminEventoUsuariosView';
import layoutStyles from '@/components/home/AdminHome.module.scss';

export default function AdminEventoUsuariosPage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <div className={layoutStyles.content}>
      <AdminEventoUsuariosView idEvento={idEvento} />
    </div>
  );
}
