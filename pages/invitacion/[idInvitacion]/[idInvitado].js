import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import InvitationRenderer from '@/components/invitaciones-publicas/InvitationRenderer';
import AnimatedDesktopBackground from '@/components/invitaciones-publicas/AnimatedDesktopBackground';
import { confirmarInvitacionPublica } from '@/components/initialized/data/helpersPublicInvitacion';
import terracotaToastStyles from '@/components/invitaciones-publicas/templates/wedding-terracota/toast.module.scss';
import classicToastStyles from '@/components/invitaciones-publicas/templates/wedding-classic/toast.module.scss';
import olivaToastStyles from '@/components/invitaciones-publicas/templates/wedding-oliva/toast.module.scss';
import { normalizeTemplateKey } from '@/components/invitaciones-publicas/registry/templateKey';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { waitForInitialAssets } from '@/components/invitaciones-publicas/waitForInitialAssets';

const ATTENDANCE_OPTIONS = [
  { value: 1, label: 'Asistiré' },
  { value: 2, label: 'Quizá' },
  { value: 3, label: 'No asistiré' },
];

function normalizeGuests(listaInvitados = []) {
  return Array.isArray(listaInvitados)
    ? listaInvitados.map((item) => ({
        ...item,
        confirmado: Number(item?.confirmado || 0),
      }))
    : [];
}

function getToastStylesByTemplate(templateKey) {
  if (normalizeTemplateKey(templateKey) === 'wedding_oliva') return olivaToastStyles;
  if (normalizeTemplateKey(templateKey) === 'wedding_terracota') {
    return terracotaToastStyles;
  }

  return classicToastStyles;
}

function renderAttendanceToast(title, message, templateKey) {
  const toastStyles = getToastStylesByTemplate(templateKey);

  return toast.custom((toastInstance) => (
    <div className={toastStyles.toastCard}>
      <strong className={toastStyles.toastTitle}>{title}</strong>
      <span className={toastStyles.toastMessage}>{message}</span>
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
  canonicalUrl,
  seoImageAbsolute,
}) {
  const [guests, setGuests] = useState(() => normalizeGuests(listaInvitados));
  const [savingGuestIds, setSavingGuestIds] = useState([]);
  const [cardReady, setCardReady] = useState(false);
  const [confirmationClosed, setConfirmationClosed] = useState(Boolean(invitacion?.confirmationClosed));
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const deadline = new Date(invitacion?.fechaHoraLimiteConfirmar || '').getTime();
    if (!Number.isFinite(deadline)) return undefined;
    const check = () => {
      if (Date.now() >= deadline) setConfirmationClosed(true);
    };
    check();
    const timer = window.setInterval(check, 1000);
    return () => window.clearInterval(timer);
  }, [invitacion?.fechaHoraLimiteConfirmar]);
  const invitationRootRef = useRef(null);

  const seo = evento?.seo || {};
  const seoTitle = seo?.title || 'Invitacion Altezza';
  const seoDescription = seo?.description || 'Invitacion digital de Altezza.';
  const fallbackImage = seo?.image || evento?.imagenPrincipal || '';
  const absoluteImage = seoImageAbsolute || fallbackImage;
  const pageUrl = String(canonicalUrl || '').trim();
  const siteName = 'Altezza Invitaciones';
  const imageAlt = `${invitacion?.nombre || evento?.nombre || 'Invitacion'} | portada`;
  const ogImageType = (() => {
    const normalized = String(absoluteImage || '').toLowerCase();
    if (normalized.endsWith('.svg')) return 'image/svg+xml';
    if (normalized.endsWith('.png')) return 'image/png';
    if (normalized.endsWith('.webp')) return 'image/webp';
    if (normalized.endsWith('.jpg') || normalized.endsWith('.jpeg')) return 'image/jpeg';
    return 'image/jpeg';
  })();
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
    if (confirmationClosed || savingGuestIds.includes(Number(idInvitado))) return;

    const previousGuest = guests.find((item) => Number(item.id) === Number(idInvitado));
    setFeedback((current) => ({ ...current, [idInvitado]: null }));
    setGuests((current) => current.map((item) => (
      Number(item.id) === Number(idInvitado)
        ? { ...item, confirmado }
        : item
    )));
    setSavingGuestIds((current) => [...current, Number(idInvitado)]);

    try {
      await confirmarInvitacionPublica({
        idInvitacion: invitacion.id,
        respuestas: [{
          idInvitado,
          confirmado: Number(confirmado || 0),
        }],
      });

      setFeedback((current) => ({ ...current, [idInvitado]: { error: false, message: 'Respuesta guardada.' } }));
      renderAttendanceToast('Actualizado', resolveAttendanceMessage(confirmado), evento?.templateKey);
    } catch (error) {
      setGuests((current) => current.map((guest) => Number(guest.id) === Number(idInvitado)
        ? { ...guest, confirmado: previousGuest?.confirmado || 0 } : guest));
      if (error?.status === 409) setConfirmationClosed(true);
      setFeedback((current) => ({ ...current, [idInvitado]: {
        error: true,
        message: error?.data?.message || 'No fue posible guardar la respuesta. Inténtalo de nuevo.',
      } }));
      renderAttendanceToast(
        'No actualizado',
        error?.data?.message || error?.message || 'No fue posible guardar la confirmacion.',
        evento?.templateKey
      );
    } finally {
      setSavingGuestIds((current) => current.filter((item) => item !== Number(idInvitado)));
    }
  }

  const attendanceState = useMemo(() => ({
    guests,
    closed: confirmationClosed,
    feedback,
    options: ATTENDANCE_OPTIONS,
    isSavingGuest: (idInvitado) => savingGuestIds.includes(Number(idInvitado)),
    onChange: handleChangeGuest,
  }), [guests, savingGuestIds, confirmationClosed, feedback]);

  useEffect(() => {
    const controller = new AbortController();
    setCardReady(false);
    waitForInitialAssets(invitationRootRef.current, {
      signal: controller.signal,
      ...(normalizeTemplateKey(evento?.templateKey) === 'wedding_lemoncello' ? { timeoutMs: 10000 } : {}),
    }).then(() => {
      if (!controller.signal.aborted) setCardReady(true);
    });
    return () => controller.abort();
  }, [modules, evento?.id, evento?.templateKey, invitacion?.id]);

  const InvitationBackground = normalizeTemplateKey(evento?.templateKey) === 'wedding_lemoncello' ? Fragment : AnimatedDesktopBackground;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index,follow" />
        {pageUrl ? <link rel="canonical" href={pageUrl} /> : null}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_CO" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {pageUrl ? <meta property="og:url" content={pageUrl} /> : null}
        {absoluteImage ? <meta property="og:image" content={absoluteImage} /> : null}
        {absoluteImage ? <meta property="og:image:alt" content={imageAlt} /> : null}
        {absoluteImage ? <meta property="og:image:width" content="1200" /> : null}
        {absoluteImage ? <meta property="og:image:height" content="630" /> : null}
        {absoluteImage ? <meta property="og:image:type" content={ogImageType} /> : null}
        <meta name="twitter:card" content={absoluteImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {absoluteImage ? <meta name="twitter:image" content={absoluteImage} /> : null}
        {absoluteImage ? <meta name="twitter:image:alt" content={imageAlt} /> : null}
      </Head>

      <InvitationBackground>
        <div ref={invitationRootRef}>
          <InvitationRenderer
            evento={evento}
            invitacion={invitacion}
            invitadoActual={invitadoActual}
            listaInvitados={guests}
            modules={modules}
            attendanceState={attendanceState}
            presentationReady={cardReady}
          />
        </div>
      </InvitationBackground>
      {!cardReady ? (
        <div
          role="status" aria-live="polite"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2147483647,
          }}
        >
          <LoadingScreen mensaje="Cargando invitación…" />
        </div>
      ) : null}
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  const { idInvitacion, idInvitado } = params || {};
  const host = req?.headers?.host;
  const rawProto = req?.headers?.['x-forwarded-proto'];
  const proto = String(rawProto || 'https').split(',')[0].trim() || 'https';
  const origin = host ? `${proto}://${host}` : '';
  const baseInternal = process.env.HOST_NAME_INTERNAL;
  // Local previews should fetch directly instead of looping through a temporary tunnel.
  const useLocalBackend = (process.env.NODE_ENV !== 'production' || process.env.ALTEZZA_LOCAL_PREVIEW === '1') && baseInternal;
  const endpoint = useLocalBackend
    ? `${baseInternal}/public/invitaciones/${idInvitacion}/${idInvitado}`
    : host
    ? `${origin}/api/responseAltezza/public/invitaciones/${idInvitacion}/${idInvitado}`
    : `${baseInternal}/public/invitaciones/${idInvitacion}/${idInvitado}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 404) {
      console.warn('[SSR invitacion] backend 404', {
        idInvitacion,
        idInvitado,
        endpoint,
        hostName: process.env.HOST_NAME,
        hostNameInternal: process.env.HOST_NAME_INTERNAL,
      });
      return { notFound: true };
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error('[SSR invitacion] backend non-OK', {
        status: response.status,
        idInvitacion,
        idInvitado,
        endpoint,
        body: body?.slice?.(0, 300),
      });
      throw new Error(`Error HTTP ${response.status}`);
    }

    const payload = await response.json();

    if (!payload?.evento || !payload?.invitacion || !payload?.invitadoActual) {
      console.warn('[SSR invitacion] payload incompleto', {
        idInvitacion,
        idInvitado,
        endpoint,
        hasEvento: Boolean(payload?.evento),
        hasInvitacion: Boolean(payload?.invitacion),
        hasInvitadoActual: Boolean(payload?.invitadoActual),
      });
    }

    const seoImageRaw = payload?.evento?.seo?.image || payload?.evento?.imagenPrincipal || '';
    const resolvedSeoImage = String(seoImageRaw || '').trim()
      ? (String(seoImageRaw || '').startsWith('/') && origin
        ? `${origin}${String(seoImageRaw || '').trim()}`
        : String(seoImageRaw || '').trim())
      : '';
    const canonicalUrl = origin
      ? `${origin}/invitacion/${idInvitacion}/${idInvitado}`
      : '';

    return {
      props: {
        evento: payload?.evento || null,
        invitacion: payload?.invitacion || null,
        invitadoActual: payload?.invitadoActual || null,
        listaInvitados: Array.isArray(payload?.listaInvitados) ? payload.listaInvitados : [],
        modules: Array.isArray(payload?.modules) ? payload.modules : [],
        canonicalUrl,
        seoImageAbsolute: resolvedSeoImage,
      },
    };
  } catch (error) {
    console.error('[SSR invitacion] error catch', {
      idInvitacion,
      idInvitado,
      endpoint,
      message: error?.message,
      stack: error?.stack?.split('\n')?.slice(0, 3)?.join(' | '),
    });
    return {
      notFound: true,
    };
  }
}
