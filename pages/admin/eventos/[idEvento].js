import { useRouter } from 'next/router';
import AdminEventoWorkspace from '@/components/admin/eventos/AdminEventoWorkspace';
import PageShell from '@/components/ui/layout/PageShell';

export default function AdminEventoWorkspacePage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <PageShell surface="event">
        <AdminEventoWorkspace idEvento={idEvento} />
    </PageShell>
  );
}
