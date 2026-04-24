import { LuPartyPopper } from 'react-icons/lu';
import AdminModulePlaceholderPreview from '@/components/admin/shared/AdminModulePlaceholderPreview';

export default function AdminEventosPreview() {
  return (
    <AdminModulePlaceholderPreview
      href="/admin/eventos"
      icon={<LuPartyPopper size={18} />}
      title="Eventos"
      message="Preview temporal. El resumen del dashboard se construira en una fase posterior."
    />
  );
}
