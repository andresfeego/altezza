import { TbTruckLoading } from 'react-icons/tb';
import AdminModulePlaceholderPreview from '@/components/admin/shared/AdminModulePlaceholderPreview';

export default function AdminAlquilerPreview() {
  return (
    <AdminModulePlaceholderPreview
      href="/admin/alquiler"
      icon={<TbTruckLoading size={18} />}
      title="Alquiler"
      message="Preview temporal. El resumen del dashboard se construira en una fase posterior."
    />
  );
}
