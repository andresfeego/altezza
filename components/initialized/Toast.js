import toast from 'react-hot-toast';

let loadingToastId = null;

export const tiposAlertas = {
  info: 1,
  success: 2,
  warn: 3,
  error: 4,
  autoCloseCustom: 5,
  cargando: 6,
  cargadoSuccess: 7,
  cargadoWarn: 8,
  cargadoError: 9,
  cerrarTodas: 10,
};

function shouldForceAutoClose(duration) {
  return Number.isFinite(duration) && duration > 0;
}

function withForcedAutoClose(toastId, duration) {
  if (!toastId || !shouldForceAutoClose(duration)) return;
  setTimeout(() => {
    toast.dismiss(toastId);
  }, Number(duration) + 100);
}

export function showSuccess(message, options = {}) {
  const settings = {
    duration: 3500,
    ...options,
  };
  const id = toast.success(message, settings);
  withForcedAutoClose(id, settings.duration);
  return id;
}

export function showError(message, options = {}) {
  const settings = {
    duration: 3500,
    ...options,
  };
  const id = toast.error(message, settings);
  withForcedAutoClose(id, settings.duration);
  return id;
}

export function showInfo(message, options = {}) {
  const settings = {
    duration: 3500,
    ...options,
  };
  const id = toast(message, settings);
  withForcedAutoClose(id, settings.duration);
  return id;
}

export function showLoading(message, options = {}) {
  loadingToastId = toast.loading(message, options);
  return loadingToastId;
}

export function dismissToast(toastId) {
  toast.dismiss(toastId);
}

export function confirmToast({
  title = 'Confirmar accion',
  message = '',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'danger',
} = {}) {
  return new Promise((resolve) => {
    const id = `confirm-${Date.now()}`;
    let resolved = false;

    const cancel = () => {
      if (resolved) return;
      resolved = true;
      toast.dismiss(id);
      toast.remove(id);
      resolve(false);
    };

    const confirm = () => {
      if (resolved) return;
      resolved = true;
      toast.dismiss(id);
      toast.remove(id);
      resolve(true);
    };

    toast.custom(
      () => (
        <div
          style={{
            width: 'min(92vw, 420px)',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '14px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.16)',
            padding: '14px',
            display: 'grid',
            gap: '10px',
          }}
        >
          <strong style={{ fontSize: '0.98rem', color: '#2f2a2d' }}>{title}</strong>
          {message ? <span style={{ fontSize: '0.9rem', color: '#5a5158' }}>{message}</span> : null}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={cancel}
              style={{
                border: '1px solid rgba(0,0,0,0.12)',
                background: '#fff',
                color: '#3b3339',
                borderRadius: '999px',
                minHeight: '34px',
                padding: '0 14px',
                cursor: 'pointer',
              }}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={confirm}
              style={{
                border: '1px solid transparent',
                background: confirmVariant === 'danger' ? '#b0434f' : '#602b32',
                color: '#fff',
                borderRadius: '999px',
                minHeight: '34px',
                padding: '0 14px',
                cursor: 'pointer',
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ),
      {
        id,
        duration: 15000,
        position: 'top-center',
        onDismiss: () => {
          if (resolved) return;
          resolved = true;
          resolve(false);
        },
      }
    );
  });
}

export const nuevoMensaje = (icono, mensaje, auto) => {
  const duration = typeof auto === 'number' ? auto : undefined;
  const options = duration ? { duration } : {};

  switch (icono) {
    case tiposAlertas.info:
      return showInfo(mensaje, options);
    case tiposAlertas.success:
    case tiposAlertas.autoCloseCustom:
      return showSuccess(mensaje, options);
    case tiposAlertas.warn:
      return toast(mensaje, {
        icon: '⚠️',
        ...options,
      });
    case tiposAlertas.error:
      return showError(mensaje, options);
    case tiposAlertas.cargando:
      return showLoading(mensaje);
    case tiposAlertas.cargadoSuccess:
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
        loadingToastId = null;
      }
      return showSuccess(mensaje, options);
    case tiposAlertas.cargadoWarn:
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
        loadingToastId = null;
      }
      return toast(mensaje, {
        icon: '⚠️',
        ...options,
      });
    case tiposAlertas.cargadoError:
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
        loadingToastId = null;
      }
      return showError(mensaje, options);
    case tiposAlertas.cerrarTodas:
      toast.dismiss();
      return null;
    default:
      return showInfo(mensaje, options);
  }
};

export default toast;
