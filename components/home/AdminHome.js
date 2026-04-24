import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import PageShell from '@/components/ui/layout/PageShell';

export default function AdminHome() {
  return (
    <PageShell surface="admin">
        <AdminDashboard />
    </PageShell>
  );
}
