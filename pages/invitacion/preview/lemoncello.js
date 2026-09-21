import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import InvitationRenderer from '@/components/invitaciones-publicas/InvitationRenderer';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { waitForInitialAssets } from '@/components/invitaciones-publicas/waitForInitialAssets';
import preview from '@/components/invitaciones-publicas/templates/wedding-lemoncello/preview.json';

export default function LemoncelloPreview() {
  const rootRef = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    waitForInitialAssets(rootRef.current, { signal: controller.signal, timeoutMs: 10000 }).then(() => {
      if (!controller.signal.aborted) setReady(true);
    });
    return () => controller.abort();
  }, []);
  return <>
    <Head><title>Lemoncello · Vista previa</title><meta name="robots" content="noindex,nofollow" /></Head>
    <div ref={rootRef}><InvitationRenderer {...preview} presentationReady={ready} /></div>
    {!ready ? <div role="status" aria-live="polite"><LoadingScreen mensaje="Cargando invitación…" /></div> : null}
  </>;
}

export function getServerSideProps() {
  return process.env.NODE_ENV === 'development' ? { props: {} } : { notFound: true };
}
