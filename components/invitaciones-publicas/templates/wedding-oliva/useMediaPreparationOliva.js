import { useCallback, useEffect, useRef, useState } from 'react';
import { MEDIA_PREPARATION_TIMEOUT_MS, prepareInvitationMedia, waitForMountedMedia, withAbort } from '../../prepareInvitationMedia';
import { collectOlivaMedia, OLIVA_FONT_FACES, replacePreparedSources } from './olivaMedia';

export default function useMediaPreparationOliva(rootRef, modules, enabled = true) {
  // The key contains resources, not guests or attendance state. Saving an RSVP
  // must not restart downloads, the envelope or the music.
  const manifestKey = JSON.stringify(collectOlivaMedia(modules));
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ phase: 'loading', blobs: {}, completed: 0, total: 0 });
  const runRef = useRef(null);
  const currentKey = `${manifestKey}:${attempt}`;
  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();
    const run = { controller, prepared: null, key: currentKey };
    runRef.current = run;
    const fail = (error) => {
      if (runRef.current !== run || controller.signal.aborted) return;
      controller.abort(error);
      setState((before) => ({ ...before, key: currentKey, phase: 'error' }));
    };
    run.fail = fail;
    run.timer = setTimeout(() => fail(new Error('La preparación superó su tiempo de espera.')), MEDIA_PREPARATION_TIMEOUT_MS);
    const manifest = JSON.parse(manifestKey);
    setState({ key: currentKey, phase: 'loading', blobs: {}, completed: 0, total: manifest.length });
    const fonts = Promise.all(OLIVA_FONT_FACES.map((font) => document.fonts?.load(font)));
    Promise.all([
      prepareInvitationMedia(manifest, {
        signal: controller.signal,
        onProgress: (progress) => { if (!controller.signal.aborted) setState((before) => ({ ...before, ...progress })); },
      }).then((prepared) => { run.prepared = prepared; return prepared; }),
      withAbort(fonts, controller.signal),
    ]).then(([prepared]) => {
      if (controller.signal.aborted) { prepared.dispose(); return; }
      setState((before) => ({ ...before, phase: 'mounting', blobs: prepared.blobs }));
    }).catch(fail);
    return () => {
      runRef.current = null;
      clearTimeout(run.timer);
      controller.abort();
      run.prepared?.dispose();
    };
  }, [manifestKey, attempt, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!enabled || state.phase !== 'mounting' || state.key !== currentKey) return;
    const run = runRef.current;
    if (!run || run.controller.signal.aborted) return;
    waitForMountedMedia(rootRef.current, { signal: run.controller.signal }).then(() => {
      if (run.controller.signal.aborted || runRef.current !== run) return;
      clearTimeout(run.timer);
      setState((before) => ({ ...before, phase: 'ready' }));
    }).catch(run.fail);
  }, [state.phase, state.key, currentKey, rootRef, enabled]);

  const current = state.key === currentKey;
  return {
    ...state,
    ready: !enabled || (current && state.phase === 'ready'),
    phase: !enabled ? 'ready' : current ? state.phase : 'loading',
    modules: !enabled ? modules : modules.map((module) => ({ ...module, data: replacePreparedSources(module.data, current ? state.blobs : {}) })),
    retry,
  };
}
