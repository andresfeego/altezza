import { useRouter } from 'next/router';
import AdminEventoPreviewView from '@/components/admin/eventos/AdminEventoPreviewView';
import PageShell from '@/components/ui/layout/PageShell';

export default function AdminEventoPreviewPage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <PageShell surface="event">
        <AdminEventoPreviewView idEvento={idEvento} />
    </PageShell>
  );
}
