import { useMemo, useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import InvitationRenderer from '@/components/invitaciones-publicas/InvitationRenderer';
import { confirmarInvitacionPublica } from '@/components/initialized/data/helpersPublicInvitacion';

const ATTENDANCE_OPTIONS = [
  { value: 1, label: 'Asistire' },
  { value: 2, label: 'Quizas' },
  { value: 3, label: 'No asistire' },
];

function normalizeGuests(listaInvitados = []) {
  return Array.isArray(listaInvitados)
    ? listaInvitados.map((item) => ({
        ...item,
        confirmado: Number(item?.confirmado || 0),
      }))
    : [];
}

function renderAttendanceToast(title, message) {
  return toast.custom((toastInstance) => (
    <div
      style={{
        display: 'grid',
        gap: '6px',
        minWidth: '280px',
        maxWidth: '340px',
        padding: '16px 18px',
        borderRadius: '0',
        background: '#fff',
        border: '1px solid rgba(237, 203, 142, 0.42)',
        boxShadow: '0 14px 32px rgba(154, 129, 86, 0.16)',
        color: '#EDCB8E',
        textAlign: 'center',
      }}
    >
      <strong style={{ fontSize: '0.78rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        {title}
      </strong>
      <span style={{ fontSize: '0.96rem', lineHeight: 1.6, color: 'rgba(237, 203, 142, 0.88)' }}>
        {message}
      </span>
    </div>
  ), {
    id: `attendance-${Date.now()}`,
    position: 'top-center',
    duration: 3600,
  });
}

export default function InvitationPublicRoute({
  evento,
  invitacion,
  invitadoActual,
  listaInvitados,
  modules,
}) {
  const [guests, setGuests] = useState(() => normalizeGuests(listaInvitados));
  const [savingGuestIds, setSavingGuestIds] = useState([]);

  const seo = evento?.seo || {};
  const absoluteImage = seo?.image || evento?.imagenPrincipal || '';
  const attendanceModule = useMemo(
    () => Array.isArray(modules) ? modules.find((item) => item?.type === 'attendance_confirm') : null,
    [modules]
  );

  const attendanceConfig = attendanceModule?.config || {};
  const useCustomMessages = Boolean(attendanceConfig?.useCustomMessages);
  const customMessages = attendanceConfig?.customMessages && typeof attendanceConfig.customMessages === 'object'
    ? attendanceConfig.customMessages
    : {};

  function resolveAttendanceMessage(confirmado) {
    if (!useCustomMessages) {
      return 'Confirmacion actualizada.';
    }

    if (Number(confirmado) === 1 && customMessages?.attending) {
      return customMessages.attending;
    }

    if (Number(confirmado) === 2 && customMessages?.maybe) {
      return customMessages.maybe;
    }

    if (Number(confirmado) === 3 && customMessages?.decline) {
      return customMessages.decline;
    }

    return 'Confirmacion actualizada.';
  }

  async function handleChangeGuest(event, idInvitado, confirmado) {
    event.preventDefault();
    event.stopPropagation();
    if (savingGuestIds.includes(Number(idInvitado))) return;

    const previousGuests = guests;
    const nextGuests = guests.map((item) => (
      Number(item.id) === Number(idInvitado)
        ? { ...item, confirmado }
        : item
    ));

    setGuests(nextGuests);
    setSavingGuestIds((current) => [...current, Number(idInvitado)]);

    try {
      await confirmarInvitacionPublica({
        idInvitacion: invitacion.id,
        respuestas: [{
          idInvitado,
          confirmado: Number(confirmado || 0),
        }],
      });

      renderAttendanceToast('Actualizado', resolveAttendanceMessage(confirmado));
    } catch (error) {
      setGuests(previousGuests);
      renderAttendanceToast('No actualizado', error?.data?.message || error?.message || 'No fue posible guardar la confirmacion.');
    } finally {
      setSavingGuestIds((current) => current.filter((item) => item !== Number(idInvitado)));
    }
  }

  const attendanceState = useMemo(() => ({
    guests,
    options: ATTENDANCE_OPTIONS,
    isSavingGuest: (idInvitado) => savingGuestIds.includes(Number(idInvitado)),
    onChange: handleChangeGuest,
  }), [guests, savingGuestIds]);

  return (
    <>
      <Head>
        <title>{seo?.title || 'Invitacion Altezza'}</title>
        <meta name="description" content={seo?.description || 'Invitacion digital de Altezza.'} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo?.title || 'Invitacion Altezza'} />
        <meta property="og:description" content={seo?.description || 'Invitacion digital de Altezza.'} />
        {absoluteImage ? <meta property="og:image" content={absoluteImage} /> : null}
        <meta name="twitter:card" content={absoluteImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={seo?.title || 'Invitacion Altezza'} />
        <meta name="twitter:description" content={seo?.description || 'Invitacion digital de Altezza.'} />
        {absoluteImage ? <meta name="twitter:image" content={absoluteImage} /> : null}
      </Head>

      <InvitationRenderer
        evento={evento}
        invitacion={invitacion}
        invitadoActual={invitadoActual}
        listaInvitados={guests}
        modules={modules}
        attendanceState={attendanceState}
      />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { idInvitacion, idInvitado } = params || {};
  const endpoint = `${process.env.HOST_NAME_INTERNAL}/public/invitaciones/${idInvitacion}/${idInvitado}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 404) {
      return { notFound: true };
    }

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const payload = await response.json();

    return {
      props: {
        evento: payload?.evento || null,
        invitacion: payload?.invitacion || null,
        invitadoActual: payload?.invitadoActual || null,
        listaInvitados: Array.isArray(payload?.listaInvitados) ? payload.listaInvitados : [],
        modules: Array.isArray(payload?.modules) ? payload.modules : [],
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
