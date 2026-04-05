import { useRouter } from 'next/router';
import AdminEventoDatosView from '@/components/admin/eventos/AdminEventoDatosView';
import PageShell from '@/components/ui/layout/PageShell';

export default function AdminEventoDatosPage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <PageShell surface="event">
        <AdminEventoDatosView idEvento={idEvento} />
    </PageShell>
  );
}
