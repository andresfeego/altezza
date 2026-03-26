import { TbAlphabetLatin } from 'react-icons/tb';
import AdminModulePlaceholderPreview from '@/components/admin/shared/AdminModulePlaceholderPreview';

export default function AdminFrasesPreview() {
  return (
    <AdminModulePlaceholderPreview
      href="/admin/frases"
      icon={<TbAlphabetLatin size={18} />}
      title="Frases"
      message="Preview temporal. El resumen del dashboard se construira en una fase posterior."
    />
  );
}
