import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ModalShell from '@/components/ui/layout/ModalShell';
import Button from '@/components/ui/actions/Button';
import { updateMobiliarioCatalogStyle } from '@/components/initialized/data/mobiliarioApi';
import styles from './CatalogStyleForm.module.scss';

const FIELDS = [{ key: 'colorPrimario', label: 'Primer fondo' }, { key: 'colorSecundario', label: 'Segundo fondo' }];
const validColor = (value) => /^#[0-9a-f]{6}$/i.test(value || '');

export default function CatalogStyleForm({ catalog, onSaved, onClose }) {
  const [colors, setColors] = useState({ colorPrimario: catalog.colorPrimario, colorSecundario: catalog.colorSecundario });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { setColors({ colorPrimario: catalog.colorPrimario, colorSecundario: catalog.colorSecundario }); }, [catalog.colorPrimario, catalog.colorSecundario]);
  function change(key, value) { setColors((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })); }
  async function save(event) {
    event.preventDefault();
    const next = {};
    FIELDS.forEach(({ key }) => { if (!validColor(colors[key])) next[key] = 'Usa el formato #RRGGBB.'; });
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    try { const response = await updateMobiliarioCatalogStyle(colors); onSaved(response.item); toast.success('Colores del catálogo guardados.'); }
    catch (error) { setErrors(error.data?.fields || {}); toast.error(error.message); }
    finally { setSaving(false); }
  }
  return <ModalShell title="Colores catálogo" onClose={saving ? undefined : onClose}><form className={styles.form} onSubmit={save} noValidate>
    <fieldset disabled={saving} aria-label="Colores del catálogo"><div className={styles.fields}>{FIELDS.map(({ key, label }) => <div className={styles.field} key={key}>
      <label htmlFor={`catalog-${key}`}>{label}</label><div className={styles.control}>
        <input type="color" aria-label={`Elegir ${label.toLowerCase()}`} value={validColor(colors[key]) ? colors[key] : catalog[key]} onChange={(event) => change(key, event.target.value.toUpperCase())} />
        <input id={`catalog-${key}`} type="text" value={colors[key] || ''} maxLength={7} spellCheck={false} onChange={(event) => change(key, event.target.value.toUpperCase())} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${key}-error` : undefined} />
      </div>{errors[key] && <span className={styles.error} id={`${key}-error`}>{errors[key]}</span>}
    </div>)}</div></fieldset>
    <div className={styles.actions}><Button variant="secondary" onClick={onClose} disabled={saving}>Cancelar</Button><Button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</Button></div>
  </form></ModalShell>;
}
