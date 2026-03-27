import { useRouter } from 'next/router';
import AdminEventoWorkspace from '@/components/admin/eventos/AdminEventoWorkspace';
import layoutStyles from '@/components/home/AdminHome.module.scss';

export default function AdminEventoWorkspacePage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <div className={layoutStyles.content}>
      <AdminEventoWorkspace idEvento={idEvento} />
    </div>
  );
}
