import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/actions/Button';
import ModalShell from '@/components/ui/layout/ModalShell';
import styles from './invitados.module.scss';

function getInitialForm(invitado = null, defaultPaisTelefonoId = '') {
  return {
    nombre: invitado?.nombre || '',
    telefono: invitado?.telefono || '',
    idPaisTelefono: invitado?.idPaisTelefono || defaultPaisTelefonoId,
    whatsapp: invitado ? Boolean(invitado?.wp) : true,
    parentescoId: invitado?.parentesco || '',
    grupoEdadId: invitado?.grupoEdad || '',
  };
}

export default function InvitadoFormModal({
  open,
  invitado = null,
  parentescos = [],
  gruposEdad = [],
  paisesTelefono = [],
  saving = false,
  onClose,
  onSubmit,
}) {
  const defaultPaisTelefonoId = useMemo(() => {
    const colombia = Array.isArray(paisesTelefono)
      ? paisesTelefono.find((item) => String(item?.iso2 || '').toUpperCase() === 'CO')
      : null;
    return colombia?.id ? String(colombia.id) : '';
  }, [paisesTelefono]);

  const [form, setForm] = useState(getInitialForm(invitado, defaultPaisTelefonoId));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm(getInitialForm(invitado, defaultPaisTelefonoId));
    setErrors({});
  }, [invitado, open, defaultPaisTelefonoId]);

  const title = useMemo(() => (invitado ? 'Editar invitado' : 'Nuevo invitado'), [invitado]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!form.nombre.trim()) nextErrors.nombre = 'Ingresa el nombre del invitado.';
    if (!form.idPaisTelefono) nextErrors.idPaisTelefono = 'Selecciona un codigo de pais.';
    if (!form.parentescoId) nextErrors.parentescoId = 'Selecciona un parentesco.';
    if (!form.grupoEdadId) nextErrors.grupoEdadId = 'Selecciona un grupo de edad.';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      idPaisTelefono: Number(form.idPaisTelefono),
      whatsapp: form.whatsapp,
      parentescoId: Number(form.parentescoId),
      grupoEdadId: Number(form.grupoEdadId),
    });
  }

  if (!open) return null;

  return (
    <ModalShell
      eyebrow="Gestion de invitados"
      title={title}
      onClose={onClose}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Guardando...' : invitado ? 'Guardar cambios' : 'Crear invitado'}
          </Button>
        </>
      )}
    >
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <label className={styles.formField}>
          <span>Nombre completo</span>
          <input
            type="text"
            value={form.nombre}
            onChange={(event) => updateField('nombre', event.target.value)}
            disabled={saving}
          />
          {errors.nombre ? <small className={styles.fieldError}>{errors.nombre}</small> : null}
        </label>

        <div className={styles.formRow}>
          <label className={`${styles.formField} ${styles.formFieldCountry}`}>
            <span>Codigo pais</span>
            <select
              value={form.idPaisTelefono}
              onChange={(event) => updateField('idPaisTelefono', event.target.value)}
              disabled={saving}
            >
              <option value="">Selecciona una opcion</option>
              {paisesTelefono.map((item) => (
                <option key={item.id} value={item.id}>
                  {`${item.emojiBandera} ${item.codigoTelefono} ${item.nombre}`}
                </option>
              ))}
            </select>
            {errors.idPaisTelefono ? <small className={styles.fieldError}>{errors.idPaisTelefono}</small> : null}
          </label>

          <label className={`${styles.formField} ${styles.formFieldPhone}`}>
            <span>Telefono</span>
            <input
              type="text"
              value={form.telefono}
              onChange={(event) => updateField('telefono', event.target.value)}
              disabled={saving}
            />
          </label>
        </div>

        <label className={styles.switchField}>
          <span className={styles.switchLabel}>Disponible por WhatsApp</span>
          <span className={styles.switchControl}>
            <input
              type="checkbox"
              checked={form.whatsapp}
              onChange={(event) => updateField('whatsapp', event.target.checked)}
              disabled={saving}
            />
            <span className={styles.switchTrack} aria-hidden="true">
              <span className={styles.switchThumb} />
            </span>
          </span>
        </label>

        <label className={styles.formField}>
          <span>Parentesco</span>
          <select
            value={form.parentescoId}
            onChange={(event) => updateField('parentescoId', event.target.value)}
            disabled={saving}
          >
            <option value="">Selecciona una opcion</option>
            {parentescos.map((item) => (
              <option key={item.id} value={item.id}>{item.parentesco}</option>
            ))}
          </select>
          {errors.parentescoId ? <small className={styles.fieldError}>{errors.parentescoId}</small> : null}
        </label>

        <label className={styles.formField}>
          <span>Grupo de edad</span>
          <select
            value={form.grupoEdadId}
            onChange={(event) => updateField('grupoEdadId', event.target.value)}
            disabled={saving}
          >
            <option value="">Selecciona una opcion</option>
            {gruposEdad.map((item) => (
              <option key={item.id} value={item.id}>{item.grupo}</option>
            ))}
          </select>
          {errors.grupoEdadId ? <small className={styles.fieldError}>{errors.grupoEdadId}</small> : null}
        </label>
      </form>
    </ModalShell>
  );
}
