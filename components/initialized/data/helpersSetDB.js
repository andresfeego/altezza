import { setDB } from './helpersSetDB';

export async function uploadImagenEvento({ codigoEvento, modulo, archivos }) {
  const formData = new FormData();

  formData.append('codigoEvento', codigoEvento);
  formData.append('modulo', modulo);

  archivos.forEach((archivo) => {
    formData.append('imagenes', archivo);
  });

  return await setDB('/uploadImagenEvento', formData);
}
