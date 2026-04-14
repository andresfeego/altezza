import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/actions/Button';
import ModalShell from '@/components/ui/layout/ModalShell';
import styles from './invitaciones.module.scss';

function getInitialForm(invitacion = null) {
  return {
    label: String(invitacion?.label || '').trim(),
    mensajePersonalizado: String(invitacion?.mensaje_personalizado || '').trim(),
  };
}

export default function InvitacionFormModal({
  open,
  invitacion = null,
  saving = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(getInitialForm(invitacion));

  useEffect(() => {
    if (!open) return;
    setForm(getInitialForm(invitacion));
  }, [invitacion, open]);

  const title = useMemo(
    () => (invitacion?.id ? 'Editar invitacion' : 'Nueva invitacion'),
    [invitacion]
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      label: form.label.trim(),
      mensajePersonalizado: form.mensajePersonalizado.trim(),
    });
  }

  if (!open) return null;

  return (
    <ModalShell
      title={title}
      description="Define la etiqueta de trabajo y el mensaje base de esta invitacion antes de organizar a sus integrantes."
      onClose={onClose}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Guardando...' : invitacion?.id ? 'Guardar cambios' : 'Crear invitacion'}
          </Button>
        </>
      )}
    >
      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <label className={styles.formField}>
          <span>Label</span>
          <input
            type="text"
            value={form.label}
            onChange={(event) => updateField('label', event.target.value)}
            disabled={saving}
            placeholder="Ej. Cony y pareja"
          />
        </label>

        <label className={styles.formField}>
          <span>Mensaje personalizado</span>
          <textarea
            value={form.mensajePersonalizado}
            onChange={(event) => updateField('mensajePersonalizado', event.target.value)}
            disabled={saving}
            placeholder="Escribe un texto interno para identificar mejor esta invitacion."
          />
        </label>
      </form>
    </ModalShell>
  );
}
