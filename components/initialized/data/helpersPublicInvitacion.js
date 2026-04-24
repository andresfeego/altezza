export async function confirmarInvitacionPublica({ idInvitacion, respuestas }) {
  const url = `${process.env.HOST_NAME}/public/invitaciones/${idInvitacion}/confirmacion`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ respuestas }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.message || 'No fue posible confirmar la asistencia.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
