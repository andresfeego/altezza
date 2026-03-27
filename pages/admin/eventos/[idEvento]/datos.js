import { useRouter } from 'next/router';
import AdminEventoDatosView from '@/components/admin/eventos/AdminEventoDatosView';
import layoutStyles from '@/components/home/AdminHome.module.scss';

export default function AdminEventoDatosPage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <div className={layoutStyles.content}>
      <AdminEventoDatosView idEvento={idEvento} />
    </div>
  );
}
