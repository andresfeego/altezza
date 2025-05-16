import { setDB } from '@/components/initialized/data/SetDB';

export const uploadImagenEvento = async (file, idEvento, modulo = 'datos_evento') => {
  try {
    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('codigoEvento', idEvento);
    formData.append('modulo', modulo);

    const res = await setDB('/uploadImagenEvento', formData);
    return res?.url || null; // debe ser la URL del archivo en el servidor
  } catch (err) {
    console.error('Error al subir imagen del evento:', err);
    return null;
  }
};
