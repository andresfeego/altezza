import { useRouter } from 'next/router';
import AdminEventoPreviewView from '@/components/admin/eventos/AdminEventoPreviewView';
import layoutStyles from '@/components/home/AdminHome.module.scss';

export default function AdminEventoPreviewPage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <div className={layoutStyles.content}>
      <AdminEventoPreviewView idEvento={idEvento} />
    </div>
  );
}
