import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import InvitationRenderer from '@/components/invitaciones-publicas/InvitationRenderer';
import { confirmarInvitacionPublica } from '@/components/initialized/data/helpersPublicInvitacion';
import terracotaToastStyles from '@/components/invitaciones-publicas/templates/wedding-terracota/toast.module.scss';
import classicToastStyles from '@/components/invitaciones-publicas/templates/wedding-classic/toast.module.scss';
import LoadingScreen from '@/components/ui/LoadingScreen';

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

function getToastStylesByTemplate(templateKey) {
  if (String(templateKey || '').trim() === 'wedding_terracota') {
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

      renderAttendanceToast('Actualizado', resolveAttendanceMessage(confirmado), evento?.templateKey);
    } catch (error) {
      setGuests(previousGuests);
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
    options: ATTENDANCE_OPTIONS,
    isSavingGuest: (idInvitado) => savingGuestIds.includes(Number(idInvitado)),
    onChange: handleChangeGuest,
  }), [guests, savingGuestIds]);

  useEffect(() => {
    let cancelled = false;

    function waitForImage(img) {
      if (!img) return Promise.resolve();
      if (img.complete && img.naturalWidth > 0) {
        if (typeof img.decode === 'function') {
          return img.decode().catch(() => undefined);
        }
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const done = () => {
          img.removeEventListener('load', done);
          img.removeEventListener('error', done);
          resolve();
        };
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
    }

    async function markReadyWhenImagesLoaded() {
      try {
        if (typeof document !== 'undefined' && document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch (_error) {
        // noop
      }

      requestAnimationFrame(async () => {
        const root = invitationRootRef.current;
        const images = root ? Array.from(root.querySelectorAll('img')) : [];

        if (images.length > 0) {
          const timeoutPromise = new Promise((resolve) => {
            setTimeout(resolve, 12000);
          });

          await Promise.race([
            Promise.all(images.map((img) => waitForImage(img))),
            timeoutPromise,
          ]);
        }

        if (!cancelled) setCardReady(true);
      });
    }

    markReadyWhenImagesLoaded();

    return () => {
      cancelled = true;
    };
  }, [modules, evento?.id, invitacion?.id]);

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

      <div ref={invitationRootRef}>
        <InvitationRenderer
          evento={evento}
          invitacion={invitacion}
          invitadoActual={invitadoActual}
          listaInvitados={guests}
          modules={modules}
          attendanceState={attendanceState}
        />
      </div>
      {!cardReady ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2147483647,
          }}
        >
          <LoadingScreen mensaje="Cargando invitacion..." />
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
  const endpoint = host
    ? `${origin}/api/responseAltezza/public/invitaciones/${idInvitacion}/${idInvitado}`
    : `${baseInternal}/public/invitaciones/${idInvitacion}/${idInvitado}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
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
