import { useRouter } from 'next/router';
import AdminEventoUsuariosView from '@/components/admin/eventos/AdminEventoUsuariosView';
import PageShell from '@/components/ui/layout/PageShell';

export default function AdminEventoUsuariosPage() {
  const router = useRouter();
  const { idEvento } = router.query;

  return (
    <PageShell surface="event">
        <AdminEventoUsuariosView idEvento={idEvento} />
    </PageShell>
  );
}
