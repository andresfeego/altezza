import { MdOutlinePriceChange } from 'react-icons/md';
import AdminModulePlaceholderPreview from '@/components/admin/shared/AdminModulePlaceholderPreview';

export default function AdminCotizadorPreview() {
  return (
    <AdminModulePlaceholderPreview
      href="/admin/cotizador"
      icon={<MdOutlinePriceChange size={18} />}
      title="Cotizador"
      message="Preview temporal. El resumen del dashboard se construira en una fase posterior."
    />
  );
}
