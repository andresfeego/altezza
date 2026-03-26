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

export function showSuccess(message, options = {}) {
  return toast.success(message, options);
}

export function showError(message, options = {}) {
  return toast.error(message, options);
}

export function showInfo(message, options = {}) {
  return toast(message, options);
}

export function showLoading(message, options = {}) {
  loadingToastId = toast.loading(message, options);
  return loadingToastId;
}

export function dismissToast(toastId) {
  toast.dismiss(toastId);
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
