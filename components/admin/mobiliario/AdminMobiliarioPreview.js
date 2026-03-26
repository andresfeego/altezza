import { GiWoodenChair } from 'react-icons/gi';
import AdminModulePlaceholderPreview from '@/components/admin/shared/AdminModulePlaceholderPreview';

export default function AdminMobiliarioPreview() {
  return (
    <AdminModulePlaceholderPreview
      href="/admin/mobiliario"
      icon={<GiWoodenChair size={18} />}
      title="Mobiliario"
      message="Preview temporal. El resumen del dashboard se construira en una fase posterior."
    />
  );
}
