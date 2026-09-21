import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowDown, FiArrowUp, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';
import Button from '@/components/ui/actions/Button';
import ModalShell from '@/components/ui/layout/ModalShell';
import {
  createMobiliarioCategory,
  createMobiliarioMovement,
  createMobiliarioProduct,
  createMobiliarioVariant,
  deleteMobiliarioCategory,
  listMobiliarioMovements,
  reorderMobiliarioCategories,
  replaceMobiliarioImage,
  setMobiliarioVariantState,
  updateMobiliarioCategory,
  updateMobiliarioProduct,
  updateMobiliarioVariant,
} from '@/components/initialized/data/mobiliarioApi';
import styles from '../../../pages/admin/mobiliario/mobiliario.module.scss';

export function Field({ label, error, children, wide = false }) {
  return <label className={`${styles.field} ${wide ? styles.wide : ''}`} data-field-error={error ? 'true' : undefined}><span>{label}</span>{children}{error ? <small>{error}</small> : null}</label>;
}

function ImageField({ label, value, file, onChange, error, required }) {
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!file) { setPreview(''); return undefined; }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  const imageUrl = preview || value?.thumbUrl || value?.url;
  return <Field label={label} error={error} wide>
    <div className={styles.imageInput}>
      <div className={styles.imagePreview}>{imageUrl ? <img src={imageUrl} alt="" /> : <FiImage />}</div>
      <div><input type="file" accept="image/jpeg,image/png,image/webp" required={required} onChange={(event) => onChange(event.target.files?.[0] || null)} /><small>JPEG, PNG o WebP · máximo 10 MB</small></div>
    </div>
  </Field>;
}

function emptyPresentation(key) {
  return { clientKey: key, medidas: '', existenciaInicial: 0, activo: true };
}

export function ProductModal({ product, categories, onClose, onSaved }) {
  const editing = Boolean(product?.id);
  const formRef = useRef(null);
  const [form, setForm] = useState({ nombre: '', categoriaId: categories.find((item) => item.activo)?.id || '', color: '' });
  const [files, setFiles] = useState({ producto: null, decoracion: null });
  const [presentations, setPresentations] = useState([emptyPresentation('new-1')]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!product) return;
    setForm({ nombre: product.nombre || '', categoriaId: product.categoriaId || '', color: product.color || '' });
    setPresentations(product.variants?.length ? product.variants.map((item) => ({ ...item, clientKey: `saved-${item.id}` })) : [emptyPresentation('new-1')]);
  }, [product]);

  useEffect(() => {
    if (!Object.keys(errors).length) return;
    const firstInvalidField = formRef.current?.querySelector('[data-field-error="true"]');
    firstInvalidField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [errors]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const multiple = presentations.length > 1;
  const addPresentation = () => setPresentations((items) => [...items, emptyPresentation(`new-${Date.now()}`)]);
  const updatePresentation = (clientKey, patch) => setPresentations((items) => items.map((item) => item.clientKey === clientKey ? { ...item, ...patch } : item));
  const removePresentation = (clientKey) => setPresentations((items) => items.filter((item) => item.clientKey !== clientKey));

  function validatePresentations() {
    const next = {};
    presentations.forEach((item) => {
      const started = item.id || multiple || item.medidas.trim() || Number(item.existenciaInicial) > 0;
      if (started && !item.medidas.trim()) next[`medidas-${item.clientKey}`] = 'Indica las medidas.';
    });
    presentations.filter((item) => !item.id && (multiple || item.medidas.trim() || Number(item.existenciaInicial) > 0)).forEach((item) => {
      if (!Number.isInteger(Number(item.existenciaInicial)) || Number(item.existenciaInicial) < 0) next[`inventario-${item.clientKey}`] = 'Ingresa una cantidad válida.';
    });
    return next;
  }

  function validateForm() {
    const next = {};
    if (!form.nombre.trim()) next.nombre = 'El nombre es obligatorio.';
    if (!Number(form.categoriaId)) next.categoriaId = 'Selecciona una categoría.';
    if (!form.color.trim()) next.color = 'El color es obligatorio.';
    if (!editing && !files.producto) next.imagenProducto = 'Selecciona la imagen del producto.';
    if (!editing && !files.decoracion) next.imagenDecoracion = 'Selecciona la imagen de decoración.';
    return editing ? { ...next, ...validatePresentations() } : next;
  }

  async function save(event) {
    event?.preventDefault();
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      toast.error('Revisa los campos marcados.');
      return;
    }
    setSaving(true); setErrors({});
    try {
      let item;
      if (!editing) {
        item = (await createMobiliarioProduct({ ...form, imagenProducto: files.producto, imagenDecoracion: files.decoracion })).item;
      } else {
        item = (await updateMobiliarioProduct(product.id, form)).item;
        if (files.producto) item = (await replaceMobiliarioImage(product.id, 'producto', files.producto)).item;
        if (files.decoracion) item = (await replaceMobiliarioImage(product.id, 'decoracion', files.decoracion)).item;
        for (const presentation of presentations) {
          if (presentation.id) {
            const previous = product.variants.find((variant) => variant.id === presentation.id);
            if ((previous?.medidas || '') !== presentation.medidas) await updateMobiliarioVariant(product.id, presentation.id, { medidas: presentation.medidas });
          } else if (multiple || presentation.medidas.trim() || Number(presentation.existenciaInicial) > 0) {
            await createMobiliarioVariant(product.id, { medidas: presentation.medidas, existenciaInicial: Number(presentation.existenciaInicial) });
          }
        }
      }
      toast.success(editing ? 'Producto actualizado.' : 'Producto creado como borrador.');
      await onSaved(item); onClose();
    } catch (error) {
      setErrors(error.data?.fields || {}); toast.error(error.message);
    } finally { setSaving(false); }
  }

  async function togglePresentation(presentation) {
    try {
      await setMobiliarioVariantState(product.id, presentation.id, !presentation.activo);
      updatePresentation(presentation.clientKey, { activo: !presentation.activo });
      toast.success('Presentación actualizada.');
    } catch (error) { toast.error(error.message); }
  }

  return <ModalShell size="lg" title={editing ? 'Editar producto' : 'Nuevo producto'} description={editing ? 'Actualiza la ficha visual y administra sus presentaciones.' : 'Solo necesitas los datos esenciales y dos imágenes.'} onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button onClick={() => formRef.current?.requestSubmit()} disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button></>}>
    <form ref={formRef} id="product-form" onSubmit={save} className={styles.modalForm}>
      <div className={styles.formGrid}>
        {product?.codigo && <p>Referencia: <strong>{product.codigo}</strong></p>}
        <Field label="Nombre del producto" error={errors.nombre}><input value={form.nombre} onChange={(event) => set('nombre', event.target.value)} /></Field>
        <Field label="Categoría" error={errors.categoriaId}><select value={form.categoriaId} onChange={(event) => set('categoriaId', Number(event.target.value))}><option value="">Selecciona</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}{category.activo ? '' : ' (inactiva)'}</option>)}</select></Field>
        <Field label="Color" error={errors.color} wide><input value={form.color} onChange={(event) => set('color', event.target.value)} placeholder="Ej. Dorado" /></Field>
        <ImageField label="Imagen del producto" value={product?.imagenProducto} file={files.producto} onChange={(file) => setFiles((current) => ({ ...current, producto: file }))} error={errors.imagenProducto} required={!editing} />
        <ImageField label="Imagen de decoración" value={product?.imagenDecoracion} file={files.decoracion} onChange={(file) => setFiles((current) => ({ ...current, decoracion: file }))} error={errors.imagenDecoracion} required={!editing} />
      </div>

      {editing ? <section className={styles.additionalInfo}>
        <div className={styles.additionalHeading}><div><h3>Información adicional</h3><p>{multiple ? 'Cada tamaño conserva su propio inventario.' : 'La presentación técnica se guarda sin mostrar complejidad innecesaria.'}</p></div><Button type="button" variant="secondary" iconLeading={<FiPlus />} onClick={addPresentation}>Agregar otro tamaño</Button></div>
        <div className={styles.presentationList}>{presentations.map((presentation, index) => <div className={styles.presentationRow} key={presentation.clientKey}>
          {multiple ? <strong className={styles.presentationNumber}>Tamaño {index + 1}</strong> : null}
          <Field label="Medidas" error={errors[`medidas-${presentation.clientKey}`]}><input value={presentation.medidas || ''} onChange={(event) => updatePresentation(presentation.clientKey, { medidas: event.target.value })} placeholder="Ej. 50 cm diámetro" /></Field>
          {presentation.id ? <Field label="Inventario actual"><input value={presentation.existenciaTotal} readOnly /></Field> : <Field label="Inventario inicial" error={errors[`inventario-${presentation.clientKey}`]}><input type="number" min="0" step="1" value={presentation.existenciaInicial} onChange={(event) => updatePresentation(presentation.clientKey, { existenciaInicial: event.target.value })} /></Field>}
          <div className={styles.presentationActions}>{presentation.id ? <button type="button" onClick={() => togglePresentation(presentation)}>{presentation.activo ? 'Desactivar' : 'Activar'}</button> : presentations.length > 1 ? <button type="button" onClick={() => removePresentation(presentation.clientKey)}>Quitar</button> : null}</div>
        </div>)}</div>
      </section> : null}
    </form>
  </ModalShell>;
}

export function CategoriesModal({ categories, onClose, onChanged }) {
  const [items, setItems] = useState(categories);
  const [name, setName] = useState('');
  async function add() { try { await createMobiliarioCategory({ nombre: name }); setName(''); toast.success('Categoría creada.'); await onChanged(); } catch (error) { toast.error(error.message); } }
  async function update(item, patch) { try { await updateMobiliarioCategory(item.id, { ...item, ...patch }); toast.success('Categoría actualizada.'); await onChanged(); } catch (error) { toast.error(error.message); } }
  function rename(item) { const nombre = window.prompt('Nombre de la categoría', item.nombre); if (nombre?.trim() && nombre.trim() !== item.nombre) update(item, { nombre: nombre.trim() }); }
  async function remove(item) { if (!window.confirm(`¿Eliminar la categoría “${item.nombre}”?`)) return; try { await deleteMobiliarioCategory(item.id); toast.success('Categoría eliminada.'); await onChanged(); } catch (error) { toast.error(error.message); } }
  async function move(index, delta) { const next = [...items]; const target = index + delta; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setItems(next); try { await reorderMobiliarioCategories(next.map((item) => item.id)); await onChanged(); } catch (error) { setItems(categories); toast.error(error.message); } }
  useEffect(() => setItems(categories), [categories]);
  return <ModalShell size="lg" title="Categorías" description="Organiza, desactiva o amplía la navegación del catálogo." onClose={onClose}>
    <div className={styles.inlineCreate}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nueva categoría" /><Button onClick={add} disabled={!name.trim()}>Agregar</Button></div>
    <div className={styles.categoryList}>{items.map((item, index) => <div className={styles.categoryRow} key={item.id}><div><strong>{item.nombre}</strong><small>{item.productCount} productos</small></div><div className={styles.rowButtons}><button type="button" onClick={() => move(index, -1)} aria-label="Subir"><FiArrowUp /></button><button type="button" onClick={() => move(index, 1)} aria-label="Bajar"><FiArrowDown /></button><button type="button" onClick={() => rename(item)}>Editar</button><button type="button" onClick={() => update(item, { activo: !item.activo })}>{item.activo ? 'Desactivar' : 'Activar'}</button><button type="button" onClick={() => remove(item)} aria-label="Eliminar"><FiTrash2 /></button></div></div>)}</div>
  </ModalShell>;
}

export function MovementsModal({ product, onClose, onChanged }) {
  const variants = useMemo(() => product.variants || [], [product.variants]);
  const [variantId, setVariantId] = useState(variants[0]?.id || '');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ tipo: 'entrada', cantidad: 1, existenciaTotal: variants[0]?.existenciaTotal || 0, fueraServicio: variants[0]?.fueraServicio || 0, motivo: '' });
  const currentVariant = variants.find((variant) => variant.id === Number(variantId));
  useEffect(() => { if (!variantId) return; listMobiliarioMovements(variantId).then((response) => setItems(response.items || [])).catch((error) => toast.error(error.message)); }, [variantId]);
  async function save() { try { await createMobiliarioMovement(variantId, form); toast.success('Movimiento registrado.'); const response = await listMobiliarioMovements(variantId); setItems(response.items || []); await onChanged(); } catch (error) { toast.error(error.message); } }
  return <ModalShell size="lg" title={`Movimientos · ${product.nombre}`} description="Toda variación de inventario queda registrada con el administrador responsable." onClose={onClose}>
    {!variants.length ? <div className={styles.empty}><strong>Este producto aún no tiene inventario.</strong><span>Agrega sus medidas e inventario inicial desde Editar producto.</span></div> : <>
      <div className={styles.formGrid}><Field label={variants.length > 1 ? 'Tamaño' : 'Presentación'}><select value={variantId} onChange={(event) => { const nextId = Number(event.target.value); const next = variants.find((variant) => variant.id === nextId); setVariantId(nextId); setForm({ ...form, existenciaTotal: next?.existenciaTotal || 0, fueraServicio: next?.fueraServicio || 0 }); }}>{variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.medidas || 'Presentación única'}</option>)}</select></Field><Field label="Tipo"><select value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value, existenciaTotal: currentVariant?.existenciaTotal || 0, fueraServicio: currentVariant?.fueraServicio || 0 })}><option value="entrada">Entrada</option><option value="retiro">Retiro definitivo</option><option value="fuera_servicio">Fuera de servicio</option><option value="reincorporacion">Reincorporación</option><option value="correccion">Corrección</option></select></Field>{form.tipo === 'correccion' ? <><Field label="Existencia total corregida"><input type="number" min="0" value={form.existenciaTotal} onChange={(event) => setForm({ ...form, existenciaTotal: Number(event.target.value) })} /></Field><Field label="Fuera de servicio corregido"><input type="number" min="0" value={form.fueraServicio} onChange={(event) => setForm({ ...form, fueraServicio: Number(event.target.value) })} /></Field></> : <Field label="Cantidad"><input type="number" min="1" value={form.cantidad} onChange={(event) => setForm({ ...form, cantidad: Number(event.target.value) })} /></Field>}<Field label="Motivo"><input value={form.motivo} onChange={(event) => setForm({ ...form, motivo: event.target.value })} /></Field></div>
      <div className={styles.modalActions}><Button onClick={save}>Registrar movimiento</Button></div>
      <div className={styles.movementList}>{items.map((item) => <div key={item.id}><span><strong>{String(item.tipo).replaceAll('_', ' ')}</strong><small>{item.motivo || 'Sin observación'}</small></span><span><strong>{item.cantidad}</strong><small>{new Date(item.createdAt).toLocaleString('es-CO')}</small></span></div>)}</div>
    </>}
  </ModalShell>;
}
