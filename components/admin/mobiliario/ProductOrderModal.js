import { useEffect, useState } from 'react';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ModalShell from '@/components/ui/layout/ModalShell';
import Button from '@/components/ui/actions/Button';
import { getMobiliarioProductOrder, saveMobiliarioProductOrder } from '@/components/initialized/data/mobiliarioApi';
import styles from './ProductOrderModal.module.scss';

export default function ProductOrderModal({ categories, initialCategoryId, onClose, onSaved }) {
  const [categoryId, setCategoryId] = useState(String(initialCategoryId || categories[0]?.id || ''));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let current = true;
    setItems([]); setError(''); setDirty(false);
    if (!categoryId) return undefined;
    setLoading(true);
    getMobiliarioProductOrder(categoryId)
      .then((data) => { if (current) setItems(data.items || []); })
      .catch((err) => { if (current) setError(err.message); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [categoryId, reload]);

  function move(index, offset) {
    const target = index + offset;
    if (target < 0 || target >= items.length) return;
    setItems((current) => { const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });
    setDirty(true);
  }
  async function save() {
    setSaving(true); setError('');
    try {
      await saveMobiliarioProductOrder(categoryId, items.map((item) => item.id));
      toast.success('Orden del catálogo guardado.');
      onSaved(); onClose();
    } catch (err) { setError(err.message); toast.error(err.message); }
    finally { setSaving(false); }
  }

  return <ModalShell title="Ordenar productos" onClose={saving ? undefined : onClose}>
    <div className={styles.content}>
      <label className={styles.field}>Categoría<select value={categoryId} disabled={saving || !categories.length} onChange={(event) => setCategoryId(event.target.value)}>{!categories.length && <option value="">Sin categorías</option>}{categories.map((category) => <option value={category.id} key={category.id}>{category.nombre}</option>)}</select></label>
      {dirty && <p className={styles.hint}>Guarda el orden antes de cambiar de categoría.</p>}
      {loading ? <p role="status">Cargando productos…</p> : error ? <div role="alert" className={styles.error}><p>{error}</p><Button variant="secondary" disabled={saving} onClick={() => setReload((value) => value + 1)}>Recargar lista</Button></div> : !items.length ? <p className={styles.hint}>No hay productos en esta categoría.</p> : <ol className={styles.list} aria-label="Orden de los productos">{items.map((item, index) => <li className={styles.row} key={item.id}>
        <span className={styles.position}>{index + 1}</span><div className={styles.identity}><strong>{item.nombre}</strong><small>{item.codigo} · {item.estado}</small></div>
        <div className={styles.controls}><Button variant="ghost" aria-label={`Subir ${item.nombre}`} disabled={saving || index === 0} onClick={() => move(index, -1)}><FiArrowUp /></Button><Button variant="ghost" aria-label={`Bajar ${item.nombre}`} disabled={saving || index === items.length - 1} onClick={() => move(index, 1)}><FiArrowDown /></Button></div>
      </li>)}</ol>}
      <div className={styles.actions}><Button variant="secondary" disabled={saving} onClick={onClose}>Cancelar</Button><Button disabled={saving || loading || !dirty || Boolean(error)} onClick={save}>{saving ? 'Guardando…' : 'Guardar orden'}</Button></div>
    </div>
  </ModalShell>;
}
